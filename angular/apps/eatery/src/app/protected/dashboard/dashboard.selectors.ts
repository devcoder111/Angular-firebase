import { createFeatureSelector } from '@ngrx/store';
import { DASHBOARD_STATE_FEATURE_NAME } from './dashboard-state.module';
import { DashboardState } from './dashboard.state';

export const getDashboardState = createFeatureSelector<DashboardState>(DASHBOARD_STATE_FEATURE_NAME);
