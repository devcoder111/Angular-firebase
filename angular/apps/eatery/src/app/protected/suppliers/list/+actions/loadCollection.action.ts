import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { OrganizationSupplier } from '@shared/types/organizationSupplier.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { of } from 'rxjs/observable/of';
import { catchError, combineLatest as combineLatestOp, map, switchMap } from 'rxjs/operators';
import { AppState } from '../../../../+core/store/app.state';
import { getActiveOrganizationId } from '../../../../+core/store/selectors';
import {
  firestoreQueryStringStartsWith,
  unwrapCollectionSnapshotChanges,
} from '../../../../+shared/helpers/firestore.helper';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { SUPPLIERS_STATE_FEATURE_NAME } from '../../suppliers-state.module';
import { SuppliersState } from '../../suppliers.state';
import { getSuppliersListFilter } from '../list.selectors';
import { SuppliersListFilter } from '../listFilter.interface';
import { SuppliersListLoadCollectionFailedAction } from './loadCollectionFailed.action';
import { SuppliersListLoadCollectionSuccessfulAction } from './loadCollectionSuccessful.action';

const type = generateActionType(SUPPLIERS_STATE_FEATURE_NAME, 'List - Load collection');

export class SuppliersListLoadCollectionAction implements BaseAction<SuppliersState> {
  feature = SUPPLIERS_STATE_FEATURE_NAME;
  type = type;

  handler(state: SuppliersState): SuppliersState {
    const list = setStateProperties(state.list, {
      isLoading: true,
      loadError: null,
    });
    return setStateProperties(state, { list });
  }
}

@Injectable()
export class SuppliersListLoadCollectionActionEffect {
  @Effect()
  watchSuppliers$ = this.actions$.pipe(
    ofType(type),
    combineLatestOp(
      this.store.pipe(select(getActiveOrganizationId)),
      this.store.pipe(select(getSuppliersListFilter)), // triggers if suppliersListFilter was changed
      (action, organizationId, suppliersListFilter) => ({
        organizationId,
        suppliersListFilter,
      }),
    ),
    switchMap((data: { organizationId: string; suppliersListFilter: SuppliersListFilter }) =>
      this.db
        .collection<OrganizationSupplier>(`${CollectionNames.suppliers}`, ref => {
          let query = ref.limit(20).where('organizationId', '==', data.organizationId);
          if (data.suppliersListFilter.name) {
            const field = 'name';
            query = firestoreQueryStringStartsWith(query, field, data.suppliersListFilter.name).orderBy(field);
          }
          query = query.orderBy('createdAt', 'desc');
          return query;
        })
        .snapshotChanges()
        .pipe(map(unwrapCollectionSnapshotChanges)),
    ),
    map((items: OrganizationSupplier[]) => new SuppliersListLoadCollectionSuccessfulAction(items)),
    catchError(error => of(new SuppliersListLoadCollectionFailedAction(error))),
    // TODO for Anton: Unsubscribe when user leaves /suppliers
  );

  constructor(private actions$: Actions, private store: Store<AppState>, private db: AngularFirestore) {}
}
