import { calcDocTotals } from '@shared/helpers/taxes/taxes.helper';
import { Order } from '@shared/types/order.interface';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { ORDERS_STATE_FEATURE_NAME } from '../../orders-state.module';
import { OrdersState } from '../../orders.state';

const type = generateActionType(ORDERS_STATE_FEATURE_NAME, 'Editor - Update');

export class OrdersEditorUpdateAction implements BaseAction<OrdersState> {
  feature = ORDERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: Partial<Order>) {}

  handler(state: OrdersState, action: this): OrdersState {
    const order = setStateProperties(state.editor.order, {
      ...action.payload,
    });
    const newOrder = calcDocTotals(order, state.editor.products);
    const editor = setStateProperties(state.editor, { order: newOrder });
    return setStateProperties(state, { editor });
  }
}
