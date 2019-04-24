import { CounterLocationInvoicesDone } from '@shared/types/counterLocationInvoicesDone.interface';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { INVOICES_STATE_FEATURE_NAME } from '../../invoices-state.module';
import { InvoicesState } from '../../invoices.state';

const type = generateActionType(INVOICES_STATE_FEATURE_NAME, 'List - Set locationCounters');

export class InvoicesListLoadLocationCountersSuccessfulAction implements BaseAction<InvoicesState> {
  feature = INVOICES_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: CounterLocationInvoicesDone) {}

  handler(state: InvoicesState, action: this): InvoicesState {
    const list = setStateProperties(state.list, { locationCounters: action.payload });
    return setStateProperties(state, { list });
  }
}
