import { OrganizationSupplier } from '@shared/types/organizationSupplier.interface';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { SUPPLIERS_STATE_FEATURE_NAME } from '../../suppliers-state.module';
import { SuppliersState } from '../../suppliers.state';

const type = generateActionType(SUPPLIERS_STATE_FEATURE_NAME, 'List - Load collection successful');

export class SuppliersListLoadCollectionSuccessfulAction implements BaseAction<SuppliersState> {
  feature = SUPPLIERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: OrganizationSupplier[]) {}

  handler(state: SuppliersState, action: this): SuppliersState {
    const list = setStateProperties(state.list, {
      ids: action.payload.map(item => item.id),
      map: action.payload.reduce((items, item) => ({ ...items, [item.id]: item }), {}),
      isLoading: false,
      loadError: null,
    });
    return setStateProperties(state, { list });
  }
}
