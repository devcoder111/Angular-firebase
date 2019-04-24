import { createSelector } from '@ngrx/store';
import { InvoiceStatuses } from '@shared/values/invoiceStatuses.array';
import { isActivePositionLocation } from '../../../+core/store/selectors';
import { canInvoiceBeDeleted, canInvoiceBeUndeleted } from '../helpers/selectors.helpers';
import { getInvoicesState } from '../invoices.selectors';

export const getInvoicesEditorState = createSelector(getInvoicesState, state => state.editor);
export const getInvoicesEditorIsLoadingInvoice = createSelector(
  getInvoicesEditorState,
  state => state.isLoadingInvoice,
);
export const getInvoicesEditorLoadInvoiceError = createSelector(
  getInvoicesEditorState,
  state => state.loadInvoiceError,
);

export const getInvoicesEditorProducts = createSelector(getInvoicesEditorState, state =>
  (state.products || []).filter(product => !product.isDeleted),
);
export const getInvoicesEditorIsLoadingProducts = createSelector(
  getInvoicesEditorState,
  state => state.isLoadingProducts,
);
export const getInvoicesEditorLoadProductsError = createSelector(
  getInvoicesEditorState,
  state => state.loadProductsError,
);
export const getInvoicesEditorAdjustments = createSelector(getInvoicesEditorState, state =>
  (state.adjustments || []).filter(adjustment => !adjustment.isDeleted),
);
export const getInvoicesEditorIsLoadingAdjustments = createSelector(
  getInvoicesEditorState,
  state => state.isLoadingAdjustments,
);
export const getInvoicesEditorLoadAdjustmentsError = createSelector(
  getInvoicesEditorState,
  state => state.loadAdjustmentsError,
);
export const getInvoicesEditorIsSaving = createSelector(getInvoicesEditorState, state => state.isSaving);
export const getInvoicesEditorSaveError = createSelector(getInvoicesEditorState, state => state.saveError);
export const getInvoicesEditorInvoice = createSelector(getInvoicesEditorState, state => state.invoice);
export const getInvoicesEditorIsNew = createSelector(
  getInvoicesEditorState,
  state => state.invoice.status === InvoiceStatuses.draft.slug,
);
export const getInvoicesEditorCanBeSaved = createSelector(
  isActivePositionLocation,
  getInvoicesEditorState,
  (isActiveLocation, state) =>
    state.invoice && !state.invoice.isDeleted && state.invoice.status !== InvoiceStatuses.done.slug && isActiveLocation,
);
export const getInvoicesEditorCanModify = createSelector(
  isActivePositionLocation,
  isActiveLocation => isActiveLocation,
);
export const getInvoicesEditorIsAddProductEnabled = createSelector(
  getInvoicesEditorInvoice,
  getInvoicesEditorCanBeSaved,
  (invoice, canBeSaved) => canBeSaved && invoice.supplierId,
);
export const getInvoicesEditorIsSaveEnabled = createSelector(
  getInvoicesEditorInvoice,
  getInvoicesEditorCanBeSaved,
  getInvoicesEditorProducts,
  getInvoicesEditorAdjustments,
  getInvoicesEditorState,
  (invoice, canBeSaved, products, adjustments, editor) =>
    canBeSaved &&
    invoice.number &&
    invoice.invoiceDate &&
    invoice.supplierId &&
    products.length &&
    !products.filter(p => p.quantity <= 0).length && // No products with quantity <= 0
    !products.filter(p => p.price < 0).length && // No products with price < 0
    !products.filter(p => p.discount < 0).length && // No products with discount < 0
    !adjustments.filter(a => a.value <= 0).length && // No adjustments with value <= 0
    (editor.images || []).length, // No invoice without images
);
export const isGSTRegistered = createSelector(
  getInvoicesEditorInvoice,
  invoice => (invoice ? !!invoice.supplierIsGSTRegistered : false),
);
export const getInvoicesEditorCanBeDeleted = createSelector(
  isActivePositionLocation,
  getInvoicesEditorState,
  getInvoicesEditorIsNew,
  (isActiveLocation, editor, isNew) => canInvoiceBeDeleted(editor.invoice) && isNew && isActiveLocation,
);
export const getInvoicesEditorCanBeUndeleted = createSelector(
  isActivePositionLocation,
  getInvoicesEditorState,
  (isActiveLocation, state) => canInvoiceBeUndeleted(state.invoice) && isActiveLocation,
);
export const getInvoicesEditorInvoiceImages = createSelector(getInvoicesEditorState, state =>
  Object.values(state.images || [])
    .sort(
      (a, b) =>
        a.meta.sortingNumber < b.meta.sortingNumber ? -1 : a.meta.sortingNumber > b.meta.sortingNumber ? 1 : 0,
    )
    .map(image => image.downloadURL),
);

export const getInvoicesEditorInvoiceImagesArray = createSelector(getInvoicesEditorState, state => state.images);

export const getInvoicesEditorInvoiceCarouselImages = createSelector(
  getInvoicesEditorState,
  state => state.carousel.currentPageImages || [],
);

export const getInvoicesEditorCarouselHasNext = createSelector(getInvoicesEditorState, state => state.carousel.hasNext);
export const getInvoicesEditorCarouselHasPrev = createSelector(getInvoicesEditorState, state => state.carousel.hasPrev);
export const getInvoicesEditorImagesLoading = createSelector(getInvoicesEditorState, state => state.isLoadingImages);
