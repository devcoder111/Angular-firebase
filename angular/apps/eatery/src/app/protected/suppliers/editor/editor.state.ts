import { OrganizationSupplier } from '@shared/types/organizationSupplier.interface';

export interface SuppliersEditorState {
  isLoadingSupplier: boolean;
  supplier?: OrganizationSupplier;
  loadSupplierError: Error;
  isNew: boolean;
  isSaving: boolean;
  saveError: Error;
}

export const SuppliersEditorStateInitial: SuppliersEditorState = {
  isLoadingSupplier: false,
  supplier: null,
  loadSupplierError: null,
  isNew: false,
  isSaving: false,
  saveError: null,
};
