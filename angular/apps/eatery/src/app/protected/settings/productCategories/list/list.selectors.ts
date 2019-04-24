import { createSelector } from '@ngrx/store';
import { isDeepEqual } from '../../../../+shared/helpers/compare.helper';
import { getProductCategoriesState } from '../productCategories.selectors';
import { ProductCategoriesListStateInitial } from './list.state';

export const getProductCategoriesListState = createSelector(getProductCategoriesState, state => state.list);
export const getProductCategoriesListMap = createSelector(getProductCategoriesListState, state => state.map);
export const getProductCategoriesListIds = createSelector(getProductCategoriesListState, state => state.ids);
export const getProductCategoriesListArray = createSelector(
  getProductCategoriesListMap,
  getProductCategoriesListIds,
  (map, ids) => ids.map(id => map[id]),
);
export const getProductCategoriesListIsLoading = createSelector(
  getProductCategoriesListState,
  state => state.isLoading,
);
export const getProductCategoriesListLoadError = createSelector(
  getProductCategoriesListState,
  state => state.loadError,
);

export const getProductCategoriesListFilter = createSelector(getProductCategoriesListState, state => state.filter);
export const getProductCategoriesListIsFilterUsed = createSelector(
  getProductCategoriesListState,
  state => !isDeepEqual(state.filter, ProductCategoriesListStateInitial.filter),
);
