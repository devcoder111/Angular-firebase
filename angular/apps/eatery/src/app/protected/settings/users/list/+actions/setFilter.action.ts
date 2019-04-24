import { BaseAction, generateActionType } from '../../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { USERS_STATE_FEATURE_NAME } from '../../users-state.module';
import { UsersState } from '../../users.state';
import { UsersListFilter } from '../listFilter.interface';

const type = generateActionType(USERS_STATE_FEATURE_NAME, 'List - Set filter');

export class UsersListSetFilterAction implements BaseAction<UsersState> {
  feature = USERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: UsersListFilter) {}

  handler(state: UsersState, action: this): UsersState {
    const list = setStateProperties(state.list, {
      filter: action.payload,
    });
    return setStateProperties(state, { list });
  }
}
