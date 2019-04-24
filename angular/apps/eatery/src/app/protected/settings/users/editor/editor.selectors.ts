// import { createSelector } from '@ngrx/store';
// import { User } from '@shared/types/user.interface';
// import { isActivePositionOrganization } from '../../../+core/store/selectors';
// import { getUsersState } from '../users.selectors';
//
// export const getUsersEditorState = createSelector(getUsersState, state => state.editor);
// export const getUsersEditorIsLoadingUser = createSelector(
//   getUsersEditorState,
//   state => state.isLoadingUser,
// );
// export const getUsersEditorLoadUserError = createSelector(
//   getUsersEditorState,
//   state => state.loadUserError,
// );
// export const getUsersEditorIsNew = createSelector(getUsersEditorState, state => state.isNew);
// export const getUsersEditorIsSaving = createSelector(getUsersEditorState, state => state.isSaving);
// export const getUsersEditorSaveError = createSelector(getUsersEditorState, state => state.saveError);
// export const getUsersEditorUser = createSelector(getUsersEditorState, state => state.user);
// export const getUsersEditorCanBeSaved = createSelector(
//   isActivePositionOrganization,
//   getUsersEditorState,
//   (isActiveOrganization, state) => !!state.user && isActiveOrganization,
// );
// export const getUsersEditorIsSaveEnabled = createSelector(
//   isActivePositionOrganization,
//   getUsersEditorUser,
//   (isActiveOrganization, user: User) =>
//     user.supplierId &&
//     user.name &&
//     user.code &&
//     user.nickname &&
//     user.lastPriceFromHistory &&
//     user.userCategoryId &&
//     user.priceChangeNotificationPercentage &&
//     user.invoiceUnitTypeId &&
//     (user.orderUnitTypeId ? user.orderUnitTypeRatio > 0 : true) &&
//     isActiveOrganization,
// );
