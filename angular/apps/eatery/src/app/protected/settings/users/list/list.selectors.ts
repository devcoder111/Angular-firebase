import { createSelector } from '@ngrx/store';
import { isActivePositionOrganization } from '../../../../+core/store/selectors';
import { isDeepEqual } from '../../../../+shared/helpers/compare.helper';
import { getUsersState } from '../users.selectors';
import { UsersListStateInitial } from './list.state';

export const getUsersListState = createSelector(getUsersState, state => state.list);
export const getUsersListMap = createSelector(getUsersListState, state => state.map);
export const getUsersListIds = createSelector(getUsersListState, state => state.ids);
export const getUsersListArray = createSelector(getUsersListMap, getUsersListIds, (map, ids) => ids.map(id => map[id]));
export const getUsersListIsLoading = createSelector(getUsersListState, state => state.isLoading);
export const getUsersListLoadError = createSelector(getUsersListState, state => state.loadError);
export const getUsersListFilter = createSelector(getUsersListState, state => state.filter);
export const getUsersListIsFilterUsed = createSelector(
  getUsersListState,
  state => !isDeepEqual(state.filter, UsersListStateInitial.filter),
);

export const getUsersListCanBeModified = createSelector(
  isActivePositionOrganization,
  isActiveOrganization => isActiveOrganization,
);
