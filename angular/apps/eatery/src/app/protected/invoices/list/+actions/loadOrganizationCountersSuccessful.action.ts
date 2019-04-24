import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { INVOICES_STATE_FEATURE_NAME } from '../../invoices-state.module';
import { InvoicesState } from '../../invoices.state';
import { CounterOrganizationInvoicesDone } from '@shared/types/counterOrganizationInvoicesDone.interface';

const type = generateActionType(INVOICES_STATE_FEATURE_NAME, 'List - Set organization locationCounters');

export class InvoicesListLoadOrganizationCountersSuccessfulAction implements BaseAction<InvoicesState> {
  feature = INVOICES_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: CounterOrganizationInvoicesDone) {}

  handler(state: InvoicesState, action: this): InvoicesState {
    const list = setStateProperties(state.list, { organizationCounters: action.payload });
    return setStateProperties(state, { list });
  }
}
