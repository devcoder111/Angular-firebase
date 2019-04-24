import { calcDocTotals } from '@shared/helpers/taxes/taxes.helper';
import { Invoice } from '@shared/types/invoice.interface';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { INVOICES_STATE_FEATURE_NAME } from '../../invoices-state.module';
import { InvoicesState } from '../../invoices.state';

const type = generateActionType(INVOICES_STATE_FEATURE_NAME, 'Editor - Update');

export class InvoicesEditorUpdateAction implements BaseAction<InvoicesState> {
  feature = INVOICES_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: Partial<Invoice>) {}

  handler(state: InvoicesState, action: this): InvoicesState {
    const invoice = setStateProperties(state.editor.invoice, {
      ...action.payload,
    });
    const newInvoice = calcDocTotals(invoice, state.editor.products, state.editor.adjustments);
    const editor = setStateProperties(state.editor, { invoice: newInvoice });
    return setStateProperties(state, { editor });
  }
}
