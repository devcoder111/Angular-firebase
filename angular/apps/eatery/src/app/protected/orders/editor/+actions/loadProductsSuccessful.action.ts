import { OrderProduct } from '@shared/types/orderProduct.interface';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { ORDERS_STATE_FEATURE_NAME } from '../../orders-state.module';
import { OrdersState } from '../../orders.state';

const type = generateActionType(ORDERS_STATE_FEATURE_NAME, 'Editor - Products load successful');

export class OrdersEditorProductsLoadSuccessfulAction implements BaseAction<OrdersState> {
  feature = ORDERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: OrderProduct[]) {}

  handler(state: OrdersState, action: this): OrdersState {
    const editor = setStateProperties(state.editor, {
      isLoadingProducts: false,
      products: action.payload,
    });
    return setStateProperties(state, { editor });
  }
}
