import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { rehydrateFeatureState } from '../../../+shared/helpers/localStorageSyncState.helper';
import { BaseAction } from '../../../+shared/helpers/state.helper';
import { StatementOfAccountsState, StatementOfAccountsReportStateInitial } from './statement-of-accounts.state';

export const STATEMENT_OF_ACCOUNTS_REPORT_STATE_FEATURE_NAME = 'statementOfAccountsReport';

const initialState =
  rehydrateFeatureState<StatementOfAccountsState>(STATEMENT_OF_ACCOUNTS_REPORT_STATE_FEATURE_NAME) ||
  StatementOfAccountsReportStateInitial;

export function StatementOfAccountsReportReducer(state = initialState, action: BaseAction<StatementOfAccountsState>) {
  return action.feature === STATEMENT_OF_ACCOUNTS_REPORT_STATE_FEATURE_NAME && action.handler
    ? action.handler(state, action)
    : state;
}

@NgModule({
  imports: [
    StoreModule.forFeature(STATEMENT_OF_ACCOUNTS_REPORT_STATE_FEATURE_NAME, StatementOfAccountsReportReducer),
    EffectsModule.forFeature([]),
  ],
})
export class StatementOfAccountsReportStoreModule {}
