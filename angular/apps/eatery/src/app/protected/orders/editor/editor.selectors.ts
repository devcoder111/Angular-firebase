import { createSelector } from '@ngrx/store';
import { OrderStatuses } from '@shared/values/orderStatuses.array';
import { isActivePositionLocation } from '../../../+core/store/selectors';
import { canOrderBeDeleted, canOrderBeUndeleted, canOrderBeVoided } from '../helpers/selectors.helpers';
import { getOrdersState } from '../orders.selectors';

export const getOrdersEditorState = createSelector(getOrdersState, state => state.editor);
export const getOrdersEditorIsLoadingOrder = createSelector(getOrdersEditorState, state => state.isLoadingOrder);
export const getOrdersEditorIsLoadingProducts = createSelector(getOrdersEditorState, state => state.isLoadingProducts);
export const getOrdersEditorLoadOrderError = createSelector(getOrdersEditorState, state => state.loadOrderError);
export const getOrdersEditorLoadProductsError = createSelector(getOrdersEditorState, state => state.loadProductsError);
export const getOrdersEditorIsNew = createSelector(getOrdersEditorState, state => state.isNew);
export const getOrdersEditorIsSaving = createSelector(getOrdersEditorState, state => state.isSaving);
export const getOrdersEditorSaveError = createSelector(getOrdersEditorState, state => state.saveError);
export const getOrdersEditorOrder = createSelector(getOrdersEditorState, state => state.order);
export const getOrdersEditorSupplier = createSelector(getOrdersEditorState, state => state.supplier);
export const getOrdersEditorProducts = createSelector(getOrdersEditorState, state =>
  (state.products || []).filter(product => !product.isDeleted),
);
export const getOrdersEditorCanBeSaved = createSelector(
  isActivePositionLocation,
  getOrdersEditorState,
  (isActiveLocation, state) =>
    state.order && state.order.status === OrderStatuses.draft.slug && !state.order.isDeleted && isActiveLocation,
);
export const getOrdersEditorIsSaveEnabled = createSelector(
  isActivePositionLocation,
  getOrdersEditorState,
  getOrdersEditorCanBeSaved,
  getOrdersEditorSupplier,
  (isActiveLocation, state, canBeSaved) =>
    canBeSaved &&
    state.order.status === OrderStatuses.draft.slug &&
    (state.order.deliveryDate && state.order.deliveryDate.setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)) &&
    state.order.supplierId &&
    (!state.supplier || !state.supplier.minimumOrderTotal || state.order.total >= state.supplier.minimumOrderTotal) &&
    (!state.supplier || !state.supplier.maximumOrderTotal || state.order.total <= state.supplier.maximumOrderTotal) &&
    isActiveLocation,
);

export const isGSTRegistered = createSelector(
  isActivePositionLocation,
  getOrdersEditorOrder,
  (isActiveLocation, order) => (order ? !!order.supplierIsGSTRegistered : false) && isActiveLocation,
);

export const getOrdersEditorCanBeDeleted = createSelector(
  isActivePositionLocation,
  getOrdersEditorState,
  (isActiveLocation, state) => canOrderBeDeleted(state.order) && !state.isNew && isActiveLocation,
);
export const getOrdersEditorCanBeVoided = createSelector(
  getOrdersEditorState,
  state => canOrderBeVoided(state.order) && !state.isNew,
);
export const getOrdersEditorCanBeUndeleted = createSelector(getOrdersEditorState, state =>
  canOrderBeUndeleted(state.order),
);
export const getOrdersEditorIsSendEnabled = createSelector(
  getOrdersEditorIsSaveEnabled,
  getOrdersEditorProducts,
  (isSaveEnabled, products) => isSaveEnabled && products.length && !products.filter(p => p.quantity < 1).length,
);
export const getOrdersEditorIsReadOnly = createSelector(
  isActivePositionLocation,
  getOrdersEditorState,
  (isActiveLocation, state) => state.order && state.order.status !== OrderStatuses.draft.slug && !isActiveLocation,
);

export const getOrdersEditorCanModify = createSelector(isActivePositionLocation, isActiveLocation => isActiveLocation);
