import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { rehydrateFeatureState } from '../../../+shared/helpers/localStorageSyncState.helper';
import { BaseAction } from '../../../+shared/helpers/state.helper';
import { PriceChangeState, PriceChangeReportStateInitial } from './price-change.state';

export const PRICE_CHANGE_REPORT_STATE_FEATURE_NAME = 'priceChangeReport';

const initialState =
  rehydrateFeatureState<PriceChangeState>(PRICE_CHANGE_REPORT_STATE_FEATURE_NAME) || PriceChangeReportStateInitial;

export function PriceChangeReportReducer(state = initialState, action: BaseAction<PriceChangeState>) {
  return action.feature === PRICE_CHANGE_REPORT_STATE_FEATURE_NAME && action.handler
    ? action.handler(state, action)
    : state;
}

@NgModule({
  imports: [
    StoreModule.forFeature(PRICE_CHANGE_REPORT_STATE_FEATURE_NAME, PriceChangeReportReducer),
    EffectsModule.forFeature([]),
  ],
})
export class PriceChangeReportStoreModule {}
