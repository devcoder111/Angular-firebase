import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { rehydrateFeatureState } from '../../+shared/helpers/localStorageSyncState.helper';
import { BaseAction } from '../../+shared/helpers/state.helper';
import { LocationsEffects } from './+actions/+effects';
import { LocationsEditorStateModule } from './editor/editor-state.module';
import { LocationsListStateModule } from './list/list-state.module';
import { LocationsState, LocationsStateInitial } from './locations.state';

export const LOCATIONS_STATE_FEATURE_NAME = 'locations';

const initialState = rehydrateFeatureState<LocationsState>(LOCATIONS_STATE_FEATURE_NAME) || LocationsStateInitial;

export function LocationsReducer(state = initialState, action: BaseAction<LocationsState>) {
  return action.feature === LOCATIONS_STATE_FEATURE_NAME && action.handler ? action.handler(state, action) : state;
}

@NgModule({
  imports: [
    StoreModule.forFeature(LOCATIONS_STATE_FEATURE_NAME, LocationsReducer),
    EffectsModule.forFeature([
      ...LocationsEffects,
      ...LocationsListStateModule.effects,
      ...LocationsEditorStateModule.effects,
    ]),
  ],
})
export class LocationsStoreModule {}
