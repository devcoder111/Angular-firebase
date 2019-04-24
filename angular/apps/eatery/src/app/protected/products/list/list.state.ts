import { OrganizationProduct } from '@shared/types/organizationProduct.interface';
import { ProductsListFilter } from './listFilter.interface';

export interface ProductsListState {
  ids: string[];
  map: { [id: string]: OrganizationProduct };
  isLoading: boolean;
  loadError: Error;
  filter: ProductsListFilter;
}

export const ProductsListStateInitial: ProductsListState = {
  ids: [],
  map: {},
  isLoading: false,
  loadError: null,
  filter: {
    name: null,
  },
};
