import { ProductCategory } from '@shared/types/productCategory.interface';

export interface ProductCategoriesEditorState {
  isLoadingProductCategory: boolean;
  productCategory?: ProductCategory;
  loadProductCategoryError: Error;
  isNew: boolean; //TODO: unused for now
  isSaving: boolean;
  saveError: Error;
}

export const ProductCategoriesEditorStateInitial: ProductCategoriesEditorState = {
  isLoadingProductCategory: false,
  productCategory: null,
  loadProductCategoryError: null,
  isNew: false,
  isSaving: false,
  saveError: null,
};
