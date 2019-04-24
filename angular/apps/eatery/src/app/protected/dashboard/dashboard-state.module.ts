import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { rehydrateFeatureState } from '../../+shared/helpers/localStorageSyncState.helper';
import { BaseAction } from '../../+shared/helpers/state.helper';
import { DashboardState, DashboardStateInitial } from './dashboard.state';

export const DASHBOARD_STATE_FEATURE_NAME = 'dashboard';

const initialState = rehydrateFeatureState<DashboardState>(DASHBOARD_STATE_FEATURE_NAME) || DashboardStateInitial;

export function DashboardReducer(state = initialState, action: BaseAction<DashboardState>) {
  return action.feature === DASHBOARD_STATE_FEATURE_NAME && action.handler ? action.handler(state, action) : state;
}

@NgModule({
  imports: [StoreModule.forFeature(DASHBOARD_STATE_FEATURE_NAME, DashboardReducer), EffectsModule.forFeature([])],
})
export class DashboardStoreModule {}
