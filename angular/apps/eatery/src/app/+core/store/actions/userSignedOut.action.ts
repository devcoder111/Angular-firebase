import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { AngularFireAuth } from 'angularfire2/auth';
import { filter, tap } from 'rxjs/operators';
import { BaseAction, generateActionType } from '../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { LoggerService } from '../../../+shared/services/logger.service';
import { CoreState } from '../core.state';
import { FEATURE_NAME } from '../module';
import { AuthState } from '../types/authState.enum';

const type = generateActionType(FEATURE_NAME, 'User - Signed out');

export class UserSignedOutAction implements BaseAction<CoreState> {
  feature = FEATURE_NAME;
  type = type;

  handler(state: CoreState): CoreState {
    return setStateProperties(state, {
      user: null,
      userConfig: null,
      authError: null,
      authState: AuthState.notAuthenticated,
    });
  }
}

@Injectable()
export class UserSignedOutActionEffect {
  @Effect({ dispatch: false })
  signOutInFirebase$ = this.actions$.pipe(
    ofType(type),
    filter(() => !!this.afAuth.auth.currentUser), // if user still exists in Firebase Auth - we need to signOut there
    tap(() =>
      this.afAuth.auth
        .signOut()
        .catch(error => this.logger.error('UserSignedOutActionEffect.signOutInFirebase$', error)),
    ),
  );

  @Effect({ dispatch: false })
  redirect$ = this.actions$.pipe(
    ofType(type),
    tap(() => location.reload()),
  ); //TODO: find correct way to escape errors

  @Effect({ dispatch: false })
  clearSentryUserInfo$ = this.actions$.pipe(
    ofType(type),
    tap(() => this.logger.setUser(null)),
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private afAuth: AngularFireAuth,
    private logger: LoggerService,
  ) {}
}
