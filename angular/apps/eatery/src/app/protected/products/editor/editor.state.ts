import { OrganizationProduct } from '@shared/types/organizationProduct.interface';

export interface ProductsEditorState {
  isLoadingProduct: boolean;
  product?: OrganizationProduct;
  loadProductError: Error;
  isNew: boolean;
  isSaving: boolean;
  saveError: Error;
}

export const ProductsEditorStateInitial: ProductsEditorState = {
  isLoadingProduct: false,
  product: null,
  loadProductError: null,
  isNew: false,
  isSaving: false,
  saveError: null,
};
