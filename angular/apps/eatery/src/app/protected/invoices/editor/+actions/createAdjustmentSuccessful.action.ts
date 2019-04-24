import { calcDocTotals } from '@shared/helpers/taxes/taxes.helper';
import { InvoiceAdjustment } from '@shared/types/invoiceAdjustment.interface';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { INVOICES_STATE_FEATURE_NAME } from '../../invoices-state.module';
import { InvoicesState } from '../../invoices.state';

const type = generateActionType(INVOICES_STATE_FEATURE_NAME, 'Editor - Create adjustment successful');

export class InvoicesEditorCreateAdjustmentSuccessfulAction implements BaseAction<InvoicesState> {
  feature = INVOICES_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: InvoiceAdjustment) {}

  handler(state: InvoicesState, action: this): InvoicesState {
    const adjustments = [...state.editor.adjustments, action.payload];
    const editor = setStateProperties(state.editor, {
      adjustments,
      invoice: calcDocTotals(state.editor.invoice, state.editor.products, adjustments),
    });
    return setStateProperties(state, { editor });
  }
}
