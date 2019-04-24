import { BaseAction, generateActionType } from '../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { CoreState, UserCustomFields } from '../core.state';
import { FEATURE_NAME } from '../module';
import { AuthState } from '../types/authState.enum';

const type = generateActionType(FEATURE_NAME, 'User - Sign up');

export class UserSignUpAction implements BaseAction<CoreState> {
  feature = FEATURE_NAME;
  type = type;

  constructor(public payload: UserCustomFields) {}

  handler(state: CoreState, action: this): CoreState {
    return setStateProperties(state, {
      authState: AuthState.waitingForEmailVerification,
      authError: null,
      userCustomFields: action.payload,
    });
  }
}
