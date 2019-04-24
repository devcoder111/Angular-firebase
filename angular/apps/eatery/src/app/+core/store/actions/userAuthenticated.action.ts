import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { User } from '@shared/types/user.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { User as FirebaseUser } from 'firebase/app';
import { filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { unwrapDocSnapshotChanges } from '../../../+shared/helpers/firestore.helper';
import { BaseAction, generateActionType } from '../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { LoggerService } from '../../../+shared/services/logger.service';
import { AppState } from '../app.state';
import { CoreState } from '../core.state';
import { FEATURE_NAME } from '../module';
import { AuthState } from '../types/authState.enum';
import { UserProfileLoadedAction } from './userProfileLoaded.action';
import { UserProfileUpdatedAction } from './userProfileUpdated.action';

const type = generateActionType(FEATURE_NAME, 'User - Authenticated');

export class UserAuthenticatedAction implements BaseAction<CoreState> {
  feature = FEATURE_NAME;
  type = type;

  constructor(public payload: FirebaseUser) {}

  handler(state: CoreState, action: this): CoreState {
    return setStateProperties(state, {
      authState: action.payload.emailVerified ? AuthState.userProfileLoading : AuthState.waitingForEmailVerification,
      authError: null,
    });
  }
}

@Injectable()
export class UserAuthenticatedActionEffect {
  @Effect({ dispatch: false })
  redirectToEmailVerification$ = this.actions$.pipe(
    ofType(type),
    withLatestFrom(this.store, (action, state) => ({ state, action })),
    filter(
      (data: { state: AppState; action: UserAuthenticatedAction }) =>
        data.state.core.authState === AuthState.waitingForEmailVerification,
    ),
    tap(() => this.router.navigate(['/onboarding/sign-up'])),
  );

  @Effect()
  loadUserProfile$ = this.actions$.pipe(
    ofType(type),
    withLatestFrom(this.store, (action, state) => ({ state, action })),
    filter(
      (data: { state: AppState; action: UserAuthenticatedAction }) =>
        data.state.core.authState === AuthState.userProfileLoading,
    ),
    switchMap((data: { state: AppState; action: UserAuthenticatedAction }) =>
      this.db.doc(`${CollectionNames.users}/${data.action.payload.uid}`).snapshotChanges(),
    ),
    filter(v => !!v), // Prevent situation when User still doesn't have User document in DB
    map(unwrapDocSnapshotChanges),
    map(
      (user: User, indexOfEvent: number) =>
        indexOfEvent === 0 // if first time
          ? new UserProfileLoadedAction(user)
          : new UserProfileUpdatedAction(user),
    ),
  );

  @Effect({ dispatch: false })
  setSentryUserInfo$ = this.actions$.pipe(
    ofType(type),
    tap((action: UserAuthenticatedAction) => this.logger.setUser(action.payload)),
  );

  constructor(
    private actions$: Actions,
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private store: Store<AppState>,
    private logger: LoggerService,
    private router: Router,
  ) {}
}
