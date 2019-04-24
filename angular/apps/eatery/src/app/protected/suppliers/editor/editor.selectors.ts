import { createSelector } from '@ngrx/store';
import { isActivePositionOrganization } from '../../../+core/store/selectors';
import { getSuppliersState } from '../suppliers.selectors';

export const getSuppliersEditorState = createSelector(getSuppliersState, state => state.editor);
export const getSuppliersEditorIsLoadingSupplier = createSelector(
  getSuppliersEditorState,
  state => state.isLoadingSupplier,
);
export const getSuppliersEditorLoadSupplierError = createSelector(
  getSuppliersEditorState,
  state => state.loadSupplierError,
);
export const getSuppliersEditorIsNew = createSelector(getSuppliersEditorState, state => state.isNew);
export const getSuppliersEditorIsSaving = createSelector(getSuppliersEditorState, state => state.isSaving);
export const getSuppliersEditorSaveError = createSelector(getSuppliersEditorState, state => state.saveError);
export const getSuppliersEditorSupplier = createSelector(getSuppliersEditorState, state => state.supplier);
export const getSuppliersEditorCanBeSaved = createSelector(
  isActivePositionOrganization,
  getSuppliersEditorState,
  (isActiveOrganization, state) => !!state.supplier && isActiveOrganization,
);
export const getSuppliersEditorIsSaveEnabled = createSelector(
  isActivePositionOrganization,
  getSuppliersEditorSupplier,
  (isActiveOrganization, supplier) =>
    supplier.name &&
    supplier.businessRegistrationNumber &&
    (!supplier.isGSTRegistered || (supplier.isGSTRegistered && supplier.GSTRegistrationNumber)) &&
    Object.keys(supplier.orderMethods).length &&
    supplier.salesmanName &&
    supplier.salesmanEmail &&
    supplier.salesmanPhoneNumber &&
    isActiveOrganization,
);
export const getSuppliersEditorCanBeModified = createSelector(
  isActivePositionOrganization,
  isActiveOrganization => isActiveOrganization,
);
