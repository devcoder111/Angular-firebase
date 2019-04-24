import { User } from '@shared/types/user.interface';
import { BaseAction, generateActionType } from '../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { CoreState } from '../core.state';
import { FEATURE_NAME } from '../module';

const type = generateActionType(FEATURE_NAME, 'User - Profile updated');

export class UserProfileUpdatedAction implements BaseAction<CoreState> {
  feature = FEATURE_NAME;
  type = type;

  constructor(public payload: User) {}

  handler(state: CoreState, action: this): CoreState {
    return setStateProperties(state, { user: action.payload });
  }
}
