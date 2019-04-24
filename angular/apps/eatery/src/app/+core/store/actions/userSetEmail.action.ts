import { BaseAction, generateActionType } from '../../../+shared/helpers/state.helper';
import { CoreState } from '../core.state';
import { FEATURE_NAME } from '../module';
import { AuthState } from '../types/authState.enum';
import { setStateProperties } from '@shared/helpers/state/state.helper';

const type = generateActionType(FEATURE_NAME, 'User - Set Email');

export class UserSetEmailAction implements BaseAction<CoreState> {
  feature = FEATURE_NAME;
  type = type;

  constructor(public payload: { actionEmail: string }) {}

  handler(state: CoreState, action: this): CoreState {
    return setStateProperties(state, {
      authState: AuthState.notAuthenticated,
      emailActionEmail: action.payload.actionEmail,
    });
  }
}
