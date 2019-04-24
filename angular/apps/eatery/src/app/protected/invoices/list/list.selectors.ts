import { createSelector } from '@ngrx/store';
import { isDeepEqual } from '../../../+shared/helpers/compare.helper';
import { getInvoicesState } from '../invoices.selectors';
import { InvoicesListStateInitial } from './list.state';
import { isActivePositionLocation } from '../../../+core/store/selectors';

export const getInvoicesListState = createSelector(getInvoicesState, state => state.list);
export const getInvoicesListMap = createSelector(getInvoicesListState, state => state.map);
export const getInvoicesListIds = createSelector(getInvoicesListState, state => state.ids);
export const getInvoicesListArray = createSelector(getInvoicesListMap, getInvoicesListIds, (map, ids) =>
  ids.map(id => map[id]),
);
export const getInvoicesListOrganizationCounters = createSelector(
  getInvoicesListState,
  state => state.organizationCounters,
);
export const getInvoicesListLocationCounters = createSelector(getInvoicesListState, state => state.locationCounters);

export const getInvoicesListCounters = createSelector(
  getInvoicesListLocationCounters,
  getInvoicesListOrganizationCounters,
  isActivePositionLocation,
  (locationCounter, organizationCounter, isActiveLocation) =>
    isActiveLocation ? locationCounter : organizationCounter,
);

export const getInvoicesListIsLoading = createSelector(getInvoicesListState, state => state.isLoading);
export const getInvoicesListLoadError = createSelector(getInvoicesListState, state => state.loadError);
export const getInvoicesListFilter = createSelector(getInvoicesListState, state => state.filter);
export const getInvoicesListIsFilterUsed = createSelector(
  getInvoicesListState,
  state => !isDeepEqual(state.filter, InvoicesListStateInitial.filter),
);
