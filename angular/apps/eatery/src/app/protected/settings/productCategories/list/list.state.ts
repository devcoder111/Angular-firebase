import { ProductCategory } from '@shared/types/productCategory.interface';
import { ProductCategoriesListFilter } from './listFilter.interface';

export interface ProductCategoriesListState {
  ids: string[];
  map: { [id: string]: ProductCategory };
  isLoading: boolean;
  loadError: Error;
  isNew: boolean;
  filter: ProductCategoriesListFilter;
}

export const ProductCategoriesListStateInitial: ProductCategoriesListState = {
  ids: [],
  map: {},
  isLoading: false,
  loadError: null,
  isNew: false,
  filter: {
    isDeleted: true,
  },
};
