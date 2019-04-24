import { BaseAction, generateActionType } from '../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { CoreState } from '../core.state';
import { FEATURE_NAME } from '../module';
import { AuthState } from '../types/authState.enum';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { UserAuthErrorAction } from './userAuthError.action';
import { AppState } from '../app.state';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Store } from '@ngrx/store';
import { LoggerService } from '../../../+shared/services/logger.service';
import { getEmailActionCode } from '../selectors';
import { UserSetPasswordSuccessfulAction } from './userSetPasswordSuccessful.action';
import { fromPromise } from 'rxjs/internal-compatibility';

const type = generateActionType(FEATURE_NAME, 'User - Changing Password');

export class UserSetPasswordAction implements BaseAction<CoreState> {
  feature = FEATURE_NAME;
  type = type;

  constructor(public payload: { newPassword: string }) {}

  handler(state: CoreState): CoreState {
    return setStateProperties(state, {
      authState: AuthState.passwordChangingInProgress,
      authError: null,
    });
  }
}

@Injectable()
export class UserSetPasswordActionEffect {
  @Effect()
  setUserNewPassword$ = this.actions$.pipe(
    ofType(type),
    withLatestFrom(this.store, (action, state) => ({ state, action })),
    map(async (data: { state: AppState; action: UserSetPasswordAction }) => {
      try {
        const state = data.state;
        await this.auth.auth.confirmPasswordReset(getEmailActionCode(state), data.action.payload.newPassword);
        return new UserSetPasswordSuccessfulAction();
      } catch (error) {
        this.logger.error('setUserNewPassword$', error, {
          newPassword: data.action.payload.newPassword,
        });
        return new UserAuthErrorAction(error);
      }
    }),
    switchMap(promise => fromPromise(promise)),
  );

  constructor(
    private actions$: Actions,
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private store: Store<AppState>,
    private logger: LoggerService,
  ) {}
}
