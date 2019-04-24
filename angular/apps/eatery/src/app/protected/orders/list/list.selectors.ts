import { createSelector } from '@ngrx/store';
import { isActivePositionLocation } from '../../../+core/store/selectors';
import { isDeepEqual } from '../../../+shared/helpers/compare.helper';
import { getOrdersState } from '../orders.selectors';
import { OrdersListStateInitial } from './list.state';

export const getOrdersListState = createSelector(getOrdersState, state => state.list);
export const getOrdersListMap = createSelector(getOrdersListState, state => state.map);
export const getOrdersListIds = createSelector(getOrdersListState, state => state.ids);
export const getOrdersListArray = createSelector(getOrdersListMap, getOrdersListIds, (map, ids) =>
  ids.map(id => map[id]),
);
export const getOrdersListIsLoading = createSelector(getOrdersListState, state => state.isLoading);
export const getOrdersListLoadError = createSelector(getOrdersListState, state => state.loadError);
export const getOrdersListFilter = createSelector(getOrdersListState, state => state.filter);
export const getOrdersListIsFilterUsed = createSelector(
  getOrdersListState,
  state => !isDeepEqual(state.filter, OrdersListStateInitial.filter),
);
export const getOrdersSelectedListArray = createSelector(getOrdersState, state => state.list.selectedIds);
export const getOrdersSelectedListMap = createSelector(getOrdersSelectedListArray, selected =>
  selected.reduce(function(selectedList, item) {
    selectedList[item] = item;
    return selectedList;
  }, {}),
);

export const getOrdersListCanOrdersModify = createSelector(
  isActivePositionLocation,
  isActiveLocation => isActiveLocation,
);
