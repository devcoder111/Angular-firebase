import { Location } from '@shared/types/location.interface';
import { Order } from '@shared/types/order.interface';
import { OrderProduct } from '@shared/types/orderProduct.interface';
import { OrganizationSupplier } from '@shared/types/organizationSupplier.interface';

export interface OrdersEditorState {
  isLoadingOrder: boolean;
  isLoadingSupplier: boolean;
  isLoadingProducts: boolean;
  order?: Order;
  supplier?: OrganizationSupplier;
  products?: OrderProduct[];
  location: Location;
  loadOrderError: Error;
  loadSupplierError: Error;
  loadProductsError: Error;
  isNew: boolean;
  isSaving: boolean;
  saveError: Error;
}

export const OrdersEditorStateInitial: OrdersEditorState = {
  isLoadingOrder: false,
  isLoadingSupplier: false,
  isLoadingProducts: false,
  order: null,
  supplier: null,
  products: null,
  location: null,
  loadOrderError: null,
  loadSupplierError: null,
  loadProductsError: null,
  isNew: false,
  isSaving: false,
  saveError: null,
};
