import { BaseAction, generateActionType } from '../../../+shared/helpers/state.helper';
import { CoreState } from '../core.state';
import { FEATURE_NAME } from '../module';
import { AuthState } from '../types/authState.enum';
import { setStateProperties } from '@shared/helpers/state/state.helper';

const type = generateActionType(FEATURE_NAME, 'User - Set Password');

export class UserSetPasswordSuccessfulAction implements BaseAction<CoreState> {
  feature = FEATURE_NAME;
  type = type;

  handler(state: CoreState, action: this): CoreState {
    return setStateProperties(state, {
      authState: AuthState.passwordChanged,
      authError: null,
    });
  }
}
