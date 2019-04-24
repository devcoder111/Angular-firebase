import { OrdersEditorState, OrdersEditorStateInitial } from './editor/editor.state';
import { OrdersListState, OrdersListStateInitial } from './list/list.state';

export interface OrdersState {
  list: OrdersListState;
  editor: OrdersEditorState;
}

export const OrdersStateInitial = {
  list: OrdersListStateInitial,
  editor: OrdersEditorStateInitial,
};
