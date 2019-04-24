import { calcDocTotals } from '@shared/helpers/taxes/taxes.helper';
import { OrderProduct } from '@shared/types/orderProduct.interface';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { ORDERS_STATE_FEATURE_NAME } from '../../orders-state.module';
import { OrdersState } from '../../orders.state';

const type = generateActionType(ORDERS_STATE_FEATURE_NAME, 'Remove product');

export class OrdersEditorRemoveProductAction implements BaseAction<OrdersState> {
  feature = ORDERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: OrderProduct) {}

  handler(state: OrdersState, action: this): OrdersState {
    const product = action.payload;
    const products = state.editor.products;
    const index = products.indexOf(product);

    const newProducts = [
      ...products.slice(0, index),
      setStateProperties(product, { isDeleted: true }),
      ...products.slice(index + 1),
    ] as OrderProduct[];

    const editor = setStateProperties(state.editor, {
      products: newProducts,
      order: calcDocTotals(state.editor.order, newProducts),
    });
    return setStateProperties(state, { editor });
  }
}
