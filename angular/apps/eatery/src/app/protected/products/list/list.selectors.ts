import { createSelector } from '@ngrx/store';
import { isDeepEqual } from '../../../+shared/helpers/compare.helper';
import { getProductsState } from '../products.selectors';
import { ProductsListStateInitial } from './list.state';

export const getProductsListState = createSelector(getProductsState, state => state.list);
export const getProductsListMap = createSelector(getProductsListState, state => state.map);
export const getProductsListIds = createSelector(getProductsListState, state => state.ids);
export const getProductsListArray = createSelector(getProductsListMap, getProductsListIds, (map, ids) =>
  ids.map(id => map[id]),
);
export const getProductsListIsLoading = createSelector(getProductsListState, state => state.isLoading);
export const getProductsListLoadError = createSelector(getProductsListState, state => state.loadError);
export const getProductsListFilter = createSelector(getProductsListState, state => state.filter);
export const getProductsListIsFilterUsed = createSelector(
  getProductsListState,
  state => !isDeepEqual(state.filter, ProductsListStateInitial.filter),
);
