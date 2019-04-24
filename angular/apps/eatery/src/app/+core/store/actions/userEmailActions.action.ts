import { BaseAction, generateActionType } from '../../../+shared/helpers/state.helper';
import { CoreState } from '../core.state';
import { FEATURE_NAME } from '../module';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { AppState } from '../app.state';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Store } from '@ngrx/store';
import { LoggerService } from '../../../+shared/services/logger.service';
import { Router } from '@angular/router';
import { EmailActions } from '../types/emailActions.enum';
import { UserAuthErrorAction } from './userAuthError.action';
import { UserSetEmailAction } from './userSetEmail.action';
import { fromPromise } from 'rxjs/internal-compatibility';
import { UserAuthInfoAction } from './userAuthInfo.action';
import { setStateProperties } from '@shared/helpers/state/state.helper';

const type = generateActionType(FEATURE_NAME, 'User - Email Action');

export class UserEmailActionsAction implements BaseAction<CoreState> {
  feature = FEATURE_NAME;
  type = type;

  constructor(public payload: { actionMode: string; actionCode: string }) {}

  handler(state: CoreState, action: this): CoreState {
    return setStateProperties(state, {
      emailActionMode: action.payload.actionMode,
      emailActionCode: action.payload.actionCode,
    });
  }
}

@Injectable()
export class UserEmailActionsActionEffect {
  @Effect()
  getEmailActionsInfo$ = this.actions$.pipe(
    ofType(type),
    map(async (action: UserEmailActionsAction) => {
      try {
        switch (action.payload.actionMode) {
          case 'resetPassword':
            const email = await this.auth.auth.verifyPasswordResetCode(action.payload.actionCode);
            return new UserSetEmailAction({ actionEmail: email });
          case 'verifyEmail':
            await this.auth.auth.applyActionCode(action.payload.actionCode);
            return new UserAuthInfoAction('Your email address was successful verified.');
        }
      } catch (error) {
        this.logger.error('getEmailActionsInfo$', error, {
          actionCode: action.payload.actionCode,
        });
        return new UserAuthErrorAction(error);
      }
    }),
    switchMap(promise => fromPromise(promise)),
  );

  @Effect({ dispatch: false })
  emailActionRedirect$ = this.actions$.pipe(
    ofType(type),
    withLatestFrom(this.store, (action, state) => ({ state, action })),
    switchMap((data: { state: AppState; action: UserEmailActionsAction }) => {
      return this.router.navigate([EmailActions[data.action.payload.actionMode]]);
    }),
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
