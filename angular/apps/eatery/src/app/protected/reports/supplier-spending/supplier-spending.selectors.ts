import { createFeatureSelector } from '@ngrx/store';
import { SUPPLIER_SPENDING_REPORT_STATE_FEATURE_NAME } from './supplier-spending-state.module';
import { SupplierSpendingState } from './supplier-spending.state';

export const getSupplierSpendingReportState = createFeatureSelector<SupplierSpendingState>(
  SUPPLIER_SPENDING_REPORT_STATE_FEATURE_NAME,
);
