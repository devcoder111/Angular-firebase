import { BaseAction, generateActionType } from '../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { CoreState } from '../core.state';
import { FEATURE_NAME } from '../module';
import { Permission } from '@shared/types/permission.interface';

const type = generateActionType(FEATURE_NAME, 'Permissions - Set collection');

export class PermissionsSetCollectionAction implements BaseAction<CoreState> {
  feature = FEATURE_NAME;
  type = type;

  constructor(public payload: Permission[]) {}

  handler(state: CoreState, action: this): CoreState {
    const permissions = setStateProperties(state.permissions, {
      ids: action.payload.map(item => item.id),
      items: action.payload.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {}),
    });
    return setStateProperties(state, { permissions });
  }
}
