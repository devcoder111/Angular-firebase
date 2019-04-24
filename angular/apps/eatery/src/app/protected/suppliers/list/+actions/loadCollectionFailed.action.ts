import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { SUPPLIERS_STATE_FEATURE_NAME } from '../../suppliers-state.module';
import { SuppliersState } from '../../suppliers.state';

const type = generateActionType(SUPPLIERS_STATE_FEATURE_NAME, 'List - Load collection failed');

export class SuppliersListLoadCollectionFailedAction implements BaseAction<SuppliersState> {
  feature = SUPPLIERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: Error) {}

  handler(state: SuppliersState, action: this): SuppliersState {
    const list = setStateProperties(state.list, {
      loadError: action.payload,
      isLoading: false,
    });
    return setStateProperties(state, { list });
  }
}
