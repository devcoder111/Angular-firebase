import { BaseAction, generateActionType } from '../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { CoreState } from '../core.state';
import { FEATURE_NAME } from '../module';
import { AuthState } from '../types/authState.enum';

const type = generateActionType(FEATURE_NAME, 'User - Reset Password');

export class UserResetPasswordAction implements BaseAction<CoreState> {
  feature = FEATURE_NAME;
  type = type;

  handler(state: CoreState): CoreState {
    return setStateProperties(state, {
      authState: AuthState.emailSent,
      authError: null,
    });
  }
}
