import { createFeatureSelector } from '@ngrx/store';
import { PRICE_CHANGE_REPORT_STATE_FEATURE_NAME } from './price-change-state.module';
import { PriceChangeState } from './price-change.state';

export const getPriceChangeReportState = createFeatureSelector<PriceChangeState>(
  PRICE_CHANGE_REPORT_STATE_FEATURE_NAME,
);
