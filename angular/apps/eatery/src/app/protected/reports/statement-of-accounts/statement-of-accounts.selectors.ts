import { createFeatureSelector } from '@ngrx/store';
import { STATEMENT_OF_ACCOUNTS_REPORT_STATE_FEATURE_NAME } from './statement-of-accounts-state.module';
import { StatementOfAccountsState } from './statement-of-accounts.state';

export const getStatementOfAccountsReportState = createFeatureSelector<StatementOfAccountsState>(
  STATEMENT_OF_ACCOUNTS_REPORT_STATE_FEATURE_NAME,
);
