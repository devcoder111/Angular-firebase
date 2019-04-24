import { createSelector } from '@ngrx/store';
import { canProductCategoryBeDeleted, canProductCategoryBeRestored } from '../helpers/selectors.helpers';
import { getProductCategoriesState } from '../productCategories.selectors';

export const getProductCategoriesEditorState = createSelector(getProductCategoriesState, state => state.editor);
export const getProductCategoriesEditorIsLoadingCategory = createSelector(
  getProductCategoriesEditorState,
  state => state.isLoadingProductCategory,
);
export const getProductCategoriesEditorLoadCategoryError = createSelector(
  getProductCategoriesEditorState,
  state => state.loadProductCategoryError,
);
export const getProductCategoriesEditorIsSaving = createSelector(
  getProductCategoriesEditorState,
  state => state.isSaving,
);
export const getProductCategoriesEditorSaveError = createSelector(
  getProductCategoriesEditorState,
  state => state.saveError,
);
export const getProductCategoriesEditorCategory = createSelector(
  getProductCategoriesEditorState,
  state => state.productCategory,
);
export const getProductCategoriesEditorCanBeSaved = createSelector(
  getProductCategoriesEditorState,
  state => state.productCategory && !state.productCategory.isDeleted,
);
export const getProductCategoriesEditorIsSaveEnabled = createSelector(
  getProductCategoriesEditorState,
  getProductCategoriesEditorCanBeSaved,
  (state, canBeSaved) => canBeSaved && state.productCategory.name && state.productCategory.name.length,
);
export const getProductCategoriesEditorCanBeDeleted = createSelector(
  getProductCategoriesEditorState,
  state => canProductCategoryBeDeleted(state.productCategory) && !state.isNew,
);
export const getProductCategoriesEditorCanBeRestored = createSelector(getProductCategoriesEditorState, state =>
  canProductCategoryBeRestored(state.productCategory),
);
export const getProductCategoriesEditorIsReadOnly = createSelector(
  getProductCategoriesEditorState,
  state => state.productCategory && state.productCategory.isDeleted,
);
