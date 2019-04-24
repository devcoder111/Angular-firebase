import { UserConfig } from '@shared/types/userConfig.interface';
import { BaseAction, generateActionType } from '../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { CoreState } from '../core.state';
import { FEATURE_NAME } from '../module';

const type = generateActionType(FEATURE_NAME, 'User - UserConfig updated');

export class UserConfigUpdatedAction implements BaseAction<CoreState> {
  feature = FEATURE_NAME;
  type = type;

  constructor(public payload: UserConfig) {}

  handler(state: CoreState, action: this): CoreState {
    return setStateProperties(state, { userConfig: action.payload });
  }
}
