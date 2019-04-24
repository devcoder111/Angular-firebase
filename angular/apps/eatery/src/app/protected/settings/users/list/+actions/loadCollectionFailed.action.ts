import { BaseAction, generateActionType } from '../../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { USERS_STATE_FEATURE_NAME } from '../../users-state.module';
import { UsersState } from '../../users.state';

const type = generateActionType(USERS_STATE_FEATURE_NAME, 'List - Load collection failed');

export class UsersListLoadCollectionFailedAction implements BaseAction<UsersState> {
  feature = USERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: Error) {}

  handler(state: UsersState, action: this): UsersState {
    const list = setStateProperties(state.list, {
      loadError: action.payload,
      isLoading: false,
    });
    return setStateProperties(state, { list });
  }
}
