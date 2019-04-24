import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { User } from '@shared/types/user.interface';
import { UserConfig } from '@shared/types/userConfig.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { unwrapDocSnapshotChanges } from '../../../+shared/helpers/firestore.helper';
import { BaseAction, generateActionType } from '../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { AppState } from '../app.state';
import { CoreState, UserCustomFields } from '../core.state';
import { FEATURE_NAME } from '../module';
import { getUser, getUserCustomFields } from '../selectors';
import { UserAuthErrorAction } from './userAuthError.action';
import { UserConfigLoadedAction } from './userConfigLoaded.action';
import { UserConfigUpdatedAction } from './userConfigUpdated.action';

const type = generateActionType(FEATURE_NAME, 'User - Profile loaded');

export class UserProfileLoadedAction implements BaseAction<CoreState> {
  feature = FEATURE_NAME;
  type = type;

  constructor(public payload: User) {}

  handler(state: CoreState, action: this): CoreState {
    return setStateProperties(state, {
      user: action.payload,
    });
  }
}

@Injectable()
export class UserProfileLoadedActionEffect {
  @Effect()
  updateUserConfig$ = this.actions$.pipe(
    ofType(type),
    switchMap((action: UserProfileLoadedAction) =>
      this.db.doc(`${CollectionNames.usersConfigs}/${action.payload.id}`).snapshotChanges(),
    ),
    filter(v => !!v), // Prevent situation when User still doesn't have UserConfig in DB
    map(unwrapDocSnapshotChanges),
    map(
      (userConfig: UserConfig, indexOfEvent: number) =>
        indexOfEvent === 0 // if first time
          ? new UserConfigLoadedAction(userConfig)
          : new UserConfigUpdatedAction(userConfig),
    ),
  );

  @Effect()
  saveUserCustomFields$ = this.actions$.pipe(
    ofType(type),
    withLatestFrom(this.store, (action, state) => ({
      action,
      user: getUser(state),
      userCustomFields: getUserCustomFields(state),
    })),
    filter(
      (data: { action: UserProfileLoadedAction; user: User; userCustomFields: UserCustomFields }) =>
        !!data.userCustomFields,
    ),
    switchMap((data: { action: UserProfileLoadedAction; user: User; userCustomFields: UserCustomFields }) => {
      const { action, user, userCustomFields } = data;
      const updatedUser = setStateProperties(user, userCustomFields);
      return this.db
        .doc(`${CollectionNames.users}/${action.payload.id}`)
        .update(updatedUser)
        .then(() => null)
        .catch(error => new UserAuthErrorAction(error));
    }),
    filter(v => !!v),
  );

  constructor(private actions$: Actions, private store: Store<AppState>, private db: AngularFirestore) {}
}
