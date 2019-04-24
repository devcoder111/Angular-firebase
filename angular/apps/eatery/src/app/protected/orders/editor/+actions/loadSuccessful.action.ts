import { Order } from '@shared/types/order.interface';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { ORDERS_STATE_FEATURE_NAME } from '../../orders-state.module';
import { OrdersState } from '../../orders.state';

const type = generateActionType(ORDERS_STATE_FEATURE_NAME, 'Editor - Load successful');

export class OrdersEditorLoadSuccessfulAction implements BaseAction<OrdersState> {
  feature = ORDERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: Order) {}

  handler(state: OrdersState, action: this): OrdersState {
    const editor = setStateProperties(state.editor, {
      isLoadingOrder: false,
      loadOrderError: null,
      order: action.payload,
      isNew: false,
    });
    return setStateProperties(state, { editor });
  }
}
