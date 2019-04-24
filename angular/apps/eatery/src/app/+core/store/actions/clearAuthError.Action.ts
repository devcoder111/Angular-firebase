import { BaseAction, generateActionType } from '../../../+shared/helpers/state.helper';
import { CoreState } from '../core.state';
import { FEATURE_NAME } from '../module';
import { AuthState } from '../types/authState.enum';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { AppState } from '../app.state';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Store } from '@ngrx/store';
import { LoggerService } from '../../../+shared/services/logger.service';
import { Router } from '@angular/router';
import { setStateProperties } from '@shared/helpers/state/state.helper';

const type = generateActionType(FEATURE_NAME, 'User - Clear Auth Error');

export class ClearAuthErrorAction implements BaseAction<CoreState> {
  feature = FEATURE_NAME;
  type = type;

  constructor(public payload: boolean) {}

  handler(state: CoreState, action: this): CoreState {
    return setStateProperties(state, {
      user: null,
      userConfig: null,
      authError: null,
      authState: AuthState.notAuthenticated,
    });
  }
}

@Injectable()
export class ClearAuthErrorActionEffect {
  @Effect({ dispatch: false })
  redirect$ = this.actions$.pipe(
    ofType(type),
    map((action: ClearAuthErrorAction) => {
      if (action.payload) return this.router.navigate(['/onboarding']);
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
