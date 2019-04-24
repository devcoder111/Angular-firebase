import { Location } from '@shared/types/location.interface';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { LOCATIONS_STATE_FEATURE_NAME } from '../../locations-state.module';
import { LocationsState } from '../../locations.state';

const type = generateActionType(LOCATIONS_STATE_FEATURE_NAME, 'Editor - Load successful');

export class LocationsEditorLoadSuccessfulAction implements BaseAction<LocationsState> {
  feature = LOCATIONS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: Location) {}

  handler(state: LocationsState, action: this): LocationsState {
    const editor = setStateProperties(state.editor, {
      isLoadingLocation: false,
      loadLocationError: null,
      location: action.payload,
      isNew: false,
    });
    return setStateProperties(state, { editor });
  }
}
