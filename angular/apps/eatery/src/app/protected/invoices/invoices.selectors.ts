import { createFeatureSelector } from '@ngrx/store';
import { INVOICES_STATE_FEATURE_NAME } from './invoices-state.module';
import { InvoicesState } from './invoices.state';

export const getInvoicesState = createFeatureSelector<InvoicesState>(INVOICES_STATE_FEATURE_NAME);
