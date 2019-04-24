import { Location } from '@shared/types/location.interface';

export interface LocationsEditorState {
  isLoadingLocation: boolean;
  location?: Location;
  loadLocationError: Error;
  isNew: boolean;
  isSaving: boolean;
  saveError: Error;
}

export const LocationsEditorStateInitial: LocationsEditorState = {
  isLoadingLocation: false,
  location: null,
  loadLocationError: null,
  isNew: false,
  isSaving: false,
  saveError: null,
};
