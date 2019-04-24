import { BaseAction, generateActionType } from '../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { CoreState } from '../core.state';
import { FEATURE_NAME } from '../module';
import { AuthState } from '../types/authState.enum';

const type = generateActionType(FEATURE_NAME, 'User - Auth - Error');

export class UserAuthErrorAction implements BaseAction<CoreState> {
  feature = FEATURE_NAME;
  type = type;

  constructor(public payload: string) {}

  handler(state: CoreState, action: this): CoreState {
    return setStateProperties(state, {
      authError: action.payload,
      authState: AuthState.authenticationError,
    });
  }
}
