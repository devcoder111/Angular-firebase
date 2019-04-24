import { BaseAction, generateActionType } from '../../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { USERS_STATE_FEATURE_NAME } from '../../users-state.module';
import { UsersState } from '../../users.state';
import { Permission } from '@shared/types/permission.interface';

const type = generateActionType(USERS_STATE_FEATURE_NAME, 'List - Load collection successful');

export class UsersListLoadCollectionSuccessfulAction implements BaseAction<UsersState> {
  feature = USERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: Permission[]) {}

  handler(state: UsersState, action: this): UsersState {
    const list = setStateProperties(state.list, {
      ids: action.payload.map(item => item.id),
      map: action.payload.reduce((items, item) => ({ ...items, [item.id]: item }), {}),
      isLoading: false,
      loadError: null,
    });
    return setStateProperties(state, { list });
  }
}
