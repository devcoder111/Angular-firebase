import { createFeatureSelector } from '@ngrx/store';
import { LOCATIONS_STATE_FEATURE_NAME } from './locations-state.module';
import { LocationsState } from './locations.state';

export const getLocationsState = createFeatureSelector<LocationsState>(LOCATIONS_STATE_FEATURE_NAME);
