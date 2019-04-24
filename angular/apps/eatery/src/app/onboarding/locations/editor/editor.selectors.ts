import { createSelector } from '@ngrx/store';
import { canLocationBeDeleted, canLocationBeRestored } from '../helpers/selectors.helpers';
import { getLocationsState } from '../locations.selectors';

export const getLocationsEditorState = createSelector(getLocationsState, state => state.editor);
export const getLocationsEditorIsLoadingLocation = createSelector(
  getLocationsEditorState,
  state => state.isLoadingLocation,
);
export const getLocationsEditorLoadLocationError = createSelector(
  getLocationsEditorState,
  state => state.loadLocationError,
);
export const getLocationsEditorIsNew = createSelector(getLocationsEditorState, state => state.isNew);
export const getLocationsEditorIsSaving = createSelector(getLocationsEditorState, state => state.isSaving);
export const getLocationsEditorSaveError = createSelector(getLocationsEditorState, state => state.saveError);
export const getLocationsEditorLocation = createSelector(getLocationsEditorState, state => state.location);
export const getLocationsEditorCanBeSaved = createSelector(
  getLocationsEditorState,
  state => state.location && !state.location.isDeleted,
);
export const getLocationsEditorIsSaveEnabled = createSelector(
  getLocationsEditorState,
  getLocationsEditorCanBeSaved,
  (state, canBeSaved) =>
    canBeSaved && state.location.name && state.location.code && state.location.details && state.location.address,
);
export const getLocationsEditorCanBeDeleted = createSelector(
  getLocationsEditorState,
  state => canLocationBeDeleted(state.location) && !state.isNew,
);
export const getLocationsEditorCanBeRestored = createSelector(getLocationsEditorState, state =>
  canLocationBeRestored(state.location),
);
export const getLocationsEditorIsReadOnly = createSelector(
  getLocationsEditorState,
  state => state.location && state.location.isDeleted,
);
