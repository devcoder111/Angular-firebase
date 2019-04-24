import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { ORDERS_STATE_FEATURE_NAME } from '../../orders-state.module';
import { OrdersState } from '../../orders.state';
import { OrdersListFilter } from '../listFilter.interface';

const type = generateActionType(ORDERS_STATE_FEATURE_NAME, 'List - Set filter');

export class OrdersListSetFilterAction implements BaseAction<OrdersState> {
  feature = ORDERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: OrdersListFilter) {}

  handler(state: OrdersState, action: this): OrdersState {
    const list = setStateProperties(state.list, {
      filter: action.payload,
    });
    return setStateProperties(state, { list });
  }
}
