import { calcDocTotals } from '@shared/helpers/taxes/taxes.helper';
import { OrderProduct } from '@shared/types/orderProduct.interface';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { ORDERS_STATE_FEATURE_NAME } from '../../orders-state.module';
import { OrdersState } from '../../orders.state';

const type = generateActionType(ORDERS_STATE_FEATURE_NAME, 'Editor - Create product successful');

export class OrdersEditorCreateProductSuccessfulAction implements BaseAction<OrdersState> {
  feature = ORDERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: OrderProduct[]) {}

  handler(state: OrdersState, action: this): OrdersState {
    const products = [...(state.editor.products || []), ...action.payload];
    const editor = setStateProperties(state.editor, {
      products,
      isLoadingProducts: false,
      loadProductsError: null,
      order: calcDocTotals(state.editor.order, products),
    });
    return setStateProperties(state, { editor });
  }
}
