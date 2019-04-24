import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FEATURE_NAME } from './module';
import { ProtectedState } from './state';

export const getProtectedState = createFeatureSelector<ProtectedState>(FEATURE_NAME);

export const getProductCategoryItems = createSelector(getProtectedState, state => state.productCategories.items);
export const getProductCategoryIds = createSelector(getProtectedState, state => state.productCategories.ids);

export const getProductCategories = createSelector(getProductCategoryItems, getProductCategoryIds, (items, ids) =>
  ids.map(id => items[id]),
);

export const getUnitTypeItems = createSelector(getProtectedState, state => state.unitTypes.items);
export const getUnitTypeIds = createSelector(getProtectedState, state => state.unitTypes.ids);

export const getUnitTypes = createSelector(getUnitTypeItems, getUnitTypeIds, (items, ids) => ids.map(id => items[id]));
