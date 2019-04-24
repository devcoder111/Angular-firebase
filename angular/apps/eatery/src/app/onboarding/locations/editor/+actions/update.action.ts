import { Location } from '@shared/types/location.interface';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { LOCATIONS_STATE_FEATURE_NAME } from '../../locations-state.module';
import { LocationsState } from '../../locations.state';

const type = generateActionType(LOCATIONS_STATE_FEATURE_NAME, 'Editor - Update');

export class LocationsEditorUpdateAction implements BaseAction<LocationsState> {
  feature = LOCATIONS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: Partial<Location>) {}

  handler(state: LocationsState, action: this): LocationsState {
    const location = setStateProperties(state.editor.location, {
      ...action.payload,
    });
    const editor = setStateProperties(state.editor, { location });
    return setStateProperties(state, { editor });
  }
}
