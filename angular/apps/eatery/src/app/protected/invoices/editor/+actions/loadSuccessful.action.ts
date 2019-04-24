import { Invoice } from '@shared/types/invoice.interface';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { INVOICES_STATE_FEATURE_NAME } from '../../invoices-state.module';
import { InvoicesState } from '../../invoices.state';

const type = generateActionType(INVOICES_STATE_FEATURE_NAME, 'Editor - Load successful');

export class InvoicesEditorLoadSuccessfulAction implements BaseAction<InvoicesState> {
  feature = INVOICES_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: Invoice) {}

  handler(state: InvoicesState, action: this): InvoicesState {
    const editor = setStateProperties(state.editor, {
      isLoadingInvoice: false,
      loadInvoiceError: null,
      invoice: action.payload,
    });
    return setStateProperties(state, { editor });
  }
}
