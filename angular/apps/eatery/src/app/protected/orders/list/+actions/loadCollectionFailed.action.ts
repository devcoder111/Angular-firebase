import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { ORDERS_STATE_FEATURE_NAME } from '../../orders-state.module';
import { OrdersState } from '../../orders.state';

const type = generateActionType(ORDERS_STATE_FEATURE_NAME, 'List - Load collection failed');

export class OrdersListLoadCollectionFailedAction implements BaseAction<OrdersState> {
  feature = ORDERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: Error) {}

  handler(state: OrdersState, action: this): OrdersState {
    const list = setStateProperties(state.list, {
      loadError: action.payload,
      isLoading: false,
    });
    return setStateProperties(state, { list });
  }
}
