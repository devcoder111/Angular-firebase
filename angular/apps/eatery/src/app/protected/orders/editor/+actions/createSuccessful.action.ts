import { Order } from '@shared/types/order.interface';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { ORDERS_STATE_FEATURE_NAME } from '../../orders-state.module';
import { OrdersState } from '../../orders.state';

const type = generateActionType(ORDERS_STATE_FEATURE_NAME, 'Editor - Create successful');

export class OrdersEditorCreateSuccessfulAction implements BaseAction<OrdersState> {
  feature = ORDERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: Order) {}

  handler(state: OrdersState, action: this): OrdersState {
    const editor = setStateProperties(state.editor, {
      isNew: true,
      isLoadingOrder: false,
      order: action.payload,
      products: [],
      isSaving: false,
      supplier: null,
    });
    return setStateProperties(state, { editor });
  }
}
