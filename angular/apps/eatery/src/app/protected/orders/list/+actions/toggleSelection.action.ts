import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { ORDERS_STATE_FEATURE_NAME } from '../../orders-state.module';
import { OrdersState } from '../../orders.state';

const type = generateActionType(ORDERS_STATE_FEATURE_NAME, 'List - Toggle selection');

export class OrdersListToggleSelectionAction implements BaseAction<OrdersState> {
  feature = ORDERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: string) {}

  handler(state: OrdersState): OrdersState {
    const exists = state.list.selectedIds.includes(this.payload);
    let selectedIds: string[];
    if (exists) {
      selectedIds = state.list.selectedIds.filter(item => item !== this.payload);
    } else {
      selectedIds = [...state.list.selectedIds, this.payload];
    }
    const list = setStateProperties(state.list, { selectedIds });
    return setStateProperties(state, { list });
  }
}
