import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { SUPPLIERS_STATE_FEATURE_NAME } from '../../suppliers-state.module';
import { SuppliersState } from '../../suppliers.state';
import { SuppliersListFilter } from '../listFilter.interface';

const type = generateActionType(SUPPLIERS_STATE_FEATURE_NAME, 'List - Set filter');

export class SuppliersListSetFilterAction implements BaseAction<SuppliersState> {
  feature = SUPPLIERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: SuppliersListFilter) {}

  handler(state: SuppliersState, action: this): SuppliersState {
    const list = setStateProperties(state.list, {
      filter: action.payload,
    });
    return setStateProperties(state, { list });
  }
}
