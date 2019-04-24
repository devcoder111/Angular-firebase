import { createSelector } from '@ngrx/store';
import { OrganizationProduct } from '@shared/types/organizationProduct.interface';
import { isActivePositionOrganization } from '../../../+core/store/selectors';
import { getProductsState } from '../products.selectors';

export const getProductsEditorState = createSelector(getProductsState, state => state.editor);
export const getProductsEditorIsLoadingProduct = createSelector(
  getProductsEditorState,
  state => state.isLoadingProduct,
);
export const getProductsEditorLoadProductError = createSelector(
  getProductsEditorState,
  state => state.loadProductError,
);
export const getProductsEditorIsNew = createSelector(getProductsEditorState, state => state.isNew);
export const getProductsEditorIsSaving = createSelector(getProductsEditorState, state => state.isSaving);
export const getProductsEditorSaveError = createSelector(getProductsEditorState, state => state.saveError);
export const getProductsEditorProduct = createSelector(getProductsEditorState, state => state.product);
export const getProductsEditorCanBeSaved = createSelector(
  isActivePositionOrganization,
  getProductsEditorState,
  (isActiveOrganization, state) => !!state.product && isActiveOrganization,
);
export const getProductsEditorIsSaveEnabled = createSelector(
  isActivePositionOrganization,
  getProductsEditorProduct,
  (isActiveOrganization, product: OrganizationProduct) =>
    product.supplierId &&
    product.name &&
    product.code &&
    product.nickname &&
    product.lastPriceFromHistory &&
    product.productCategoryId &&
    product.priceChangeNotificationPercentage &&
    product.invoiceUnitTypeId &&
    (product.orderUnitTypeId ? product.orderUnitTypeRatio > 0 : true) &&
    isActiveOrganization,
);
export const getProductsEditorCanBeModified = createSelector(
  isActivePositionOrganization,
  isActiveOrganization => isActiveOrganization,
);
