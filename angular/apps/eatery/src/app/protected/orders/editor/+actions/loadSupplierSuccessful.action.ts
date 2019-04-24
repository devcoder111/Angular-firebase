import { OrganizationSupplier } from '@shared/types/organizationSupplier.interface';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { ORDERS_STATE_FEATURE_NAME } from '../../orders-state.module';
import { OrdersState } from '../../orders.state';

const type = generateActionType(ORDERS_STATE_FEATURE_NAME, 'Editor - Load Supplier successful');

export class OrdersEditorLoadSupplierSuccessfulAction implements BaseAction<OrdersState> {
  feature = ORDERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: OrganizationSupplier) {}

  handler(state: OrdersState, action: this): OrdersState {
    const editor = setStateProperties(state.editor, {
      isLoadingSupplier: false,
      loadSupplierError: null,
      supplier: action.payload,
    });
    return setStateProperties(state, { editor });
  }
}
