import { createSelector } from '@ngrx/store';
import { isDeepEqual } from '../../../+shared/helpers/compare.helper';
import { getSuppliersState } from '../suppliers.selectors';
import { SuppliersListStateInitial } from './list.state';

export const getSuppliersListState = createSelector(getSuppliersState, state => state.list);
export const getSuppliersListMap = createSelector(getSuppliersListState, state => state.map);
export const getSuppliersListIds = createSelector(getSuppliersListState, state => state.ids);
export const getSuppliersListArray = createSelector(getSuppliersListMap, getSuppliersListIds, (map, ids) =>
  ids.map(id => map[id]),
);
export const getSuppliersListIsLoading = createSelector(getSuppliersListState, state => state.isLoading);
export const getSuppliersListLoadError = createSelector(getSuppliersListState, state => state.loadError);
export const getSuppliersListFilter = createSelector(getSuppliersListState, state => state.filter);
export const getSuppliersListIsFilterUsed = createSelector(
  getSuppliersListState,
  state => !isDeepEqual(state.filter, SuppliersListStateInitial.filter),
);
