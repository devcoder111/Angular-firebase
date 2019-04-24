import { Order } from '@shared/types/order.interface';
import { OrdersListFilter } from './listFilter.interface';

export interface OrdersListState {
  ids: string[];
  map: { [id: string]: Order };
  selectedIds: string[];
  isLoading: boolean;
  loadError: Error;
  filter: OrdersListFilter;
}

export const OrdersListStateInitial: OrdersListState = {
  ids: [],
  map: {},
  selectedIds: [],
  isLoading: false,
  loadError: null,
  filter: {
    supplierId: null,
    locationId: null,
    number: null,
    status: null,
    isDeleted: false,
  },
};
