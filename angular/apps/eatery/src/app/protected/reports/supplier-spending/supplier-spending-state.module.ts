import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { rehydrateFeatureState } from '../../../+shared/helpers/localStorageSyncState.helper';
import { BaseAction } from '../../../+shared/helpers/state.helper';
import { SupplierSpendingReportStateInitial, SupplierSpendingState } from './supplier-spending.state';

export const SUPPLIER_SPENDING_REPORT_STATE_FEATURE_NAME = 'supplierSpendingReport';

const initialState =
  rehydrateFeatureState<SupplierSpendingState>(SUPPLIER_SPENDING_REPORT_STATE_FEATURE_NAME) ||
  SupplierSpendingReportStateInitial;

export function SupplierSpendingReportReducer(state = initialState, action: BaseAction<SupplierSpendingState>) {
  return action.feature === SUPPLIER_SPENDING_REPORT_STATE_FEATURE_NAME && action.handler
    ? action.handler(state, action)
    : state;
}

@NgModule({
  imports: [
    StoreModule.forFeature(SUPPLIER_SPENDING_REPORT_STATE_FEATURE_NAME, SupplierSpendingReportReducer),
    EffectsModule.forFeature([]),
  ],
})
export class SupplierSpendingReportStoreModule {}
