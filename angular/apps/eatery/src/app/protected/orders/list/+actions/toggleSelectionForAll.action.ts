import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { ORDERS_STATE_FEATURE_NAME } from '../../orders-state.module';
import { OrdersState } from '../../orders.state';

const type = generateActionType(ORDERS_STATE_FEATURE_NAME, 'List - Toggle selection for all');

export class OrdersListToggleSelectionForAllAction implements BaseAction<OrdersState> {
  feature = ORDERS_STATE_FEATURE_NAME;
  type = type;

  handler(state: OrdersState): OrdersState {
    let selectedIds: string[];
    if (state.list.selectedIds.length < state.list.ids.length) {
      selectedIds = state.list.ids;
    } else {
      selectedIds = [];
    }
    const list = setStateProperties(state.list, { selectedIds });
    return setStateProperties(state, { list });
  }
}
