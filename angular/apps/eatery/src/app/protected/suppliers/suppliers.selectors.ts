import { createFeatureSelector } from '@ngrx/store';
import { SUPPLIERS_STATE_FEATURE_NAME } from './suppliers-state.module';
import { SuppliersState } from './suppliers.state';

export const getSuppliersState = createFeatureSelector<SuppliersState>(SUPPLIERS_STATE_FEATURE_NAME);
