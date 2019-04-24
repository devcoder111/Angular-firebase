import { LocationsEditorState, LocationsEditorStateInitial } from './editor/editor.state';

export interface LocationsState {
  editor: LocationsEditorState;
}

export const LocationsStateInitial = {
  editor: LocationsEditorStateInitial,
};
