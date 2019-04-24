import { BaseAction, generateActionType } from '../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { CoreState } from '../core.state';
import { FEATURE_NAME } from '../module';
import { AuthState } from '../types/authState.enum';

const type = generateActionType(FEATURE_NAME, 'User - Sign in');

export class UserSignInAction implements BaseAction<CoreState> {
  feature = FEATURE_NAME;
  type = type;

  constructor(public payload: { email: string; password: string }) {}

  handler(state: CoreState): CoreState {
    return setStateProperties(state, {
      authState: AuthState.authenticationInProgress,
      authError: null,
    });
  }
}
