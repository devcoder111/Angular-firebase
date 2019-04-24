import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { of } from 'rxjs/observable/of';
import { catchError, combineLatest as combineLatestOp, filter, map, switchMap } from 'rxjs/operators';
import {
  firestoreQueryStringStartsWith,
  unwrapCollectionSnapshotChanges,
} from '../../../../../+shared/helpers/firestore.helper';
import { AppState } from '../../../../../+core/store/app.state';
import { BaseAction, generateActionType } from '../../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { UsersListFilter } from '../listFilter.interface';
import { USERS_STATE_FEATURE_NAME } from '../../users-state.module';
import { Permission } from '@shared/types/permission.interface';
import { UsersState } from '../../users.state';
import { UsersListLoadCollectionSuccessfulAction } from './loadCollectionSuccessful.action';
import { UsersListLoadCollectionFailedAction } from './loadCollectionFailed.action';
import { getUserConfig } from '../../../../../+core/store/selectors';
import { UserConfig } from '@shared/types/userConfig.interface';
import { getUsersListFilter } from '../list.selectors';

const type = generateActionType(USERS_STATE_FEATURE_NAME, 'List - Load collection');

export class UsersListLoadCollectionAction implements BaseAction<UsersState> {
  feature = USERS_STATE_FEATURE_NAME;
  type = type;

  handler(state: UsersState): UsersState {
    const list = setStateProperties(state.list, {
      isLoading: true,
      loadError: null,
    });
    return setStateProperties(state, { list });
  }
}

@Injectable()
export class UsersListLoadCollectionActionEffect {
  @Effect()
  watchUsers$ = this.actions$.pipe(
    ofType(type),
    combineLatestOp(
      this.store.pipe(select(getUserConfig)), // triggers if activeLocationId was changed
      this.store.pipe(select(getUsersListFilter)), // triggers if usersListFilter was changed
      (action, userConfig, usersListFilter) => ({
        userConfig,
        usersListFilter,
      }),
    ),
    filter(
      (data: { userConfig: UserConfig; usersListFilter: UsersListFilter }) =>
        !!data.userConfig && !!data.userConfig.activeOrganizationId,
    ),
    switchMap((data: { userConfig: UserConfig; usersListFilter: UsersListFilter }) =>
      this.db
        .collection<Permission>(`${CollectionNames.permissions}`, ref => {
          let query = ref.limit(20);
          query = query.where('organizationId', '==', data.userConfig.activeOrganizationId);
          if (data.usersListFilter.displayName) {
            const field = 'displayName';
            query = firestoreQueryStringStartsWith(query, field, data.usersListFilter.displayName).orderBy(field);
          }
          if (data.usersListFilter.role) {
            query = query.where('role', '==', data.usersListFilter.role);
          }
          if (!data.usersListFilter.displayName) {
            query = query.orderBy('displayName', 'asc');
          }
          return query;
        })
        .snapshotChanges(),
    ),
    map(unwrapCollectionSnapshotChanges),
    map((items: Permission[]) => new UsersListLoadCollectionSuccessfulAction(items)),
    catchError(error => of(new UsersListLoadCollectionFailedAction(error))),
    // TODO for Anton: Unsubscribe when user leaves /users
  );

  constructor(private actions$: Actions, private store: Store<AppState>, private db: AngularFirestore) {}
}
