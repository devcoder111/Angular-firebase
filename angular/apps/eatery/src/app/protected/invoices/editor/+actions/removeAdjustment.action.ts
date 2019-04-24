import { calcDocTotals } from '@shared/helpers/taxes/taxes.helper';
import { InvoiceAdjustment } from '@shared/types/invoiceAdjustment.interface';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { INVOICES_STATE_FEATURE_NAME } from '../../invoices-state.module';
import { InvoicesState } from '../../invoices.state';

const type = generateActionType(INVOICES_STATE_FEATURE_NAME, 'Remove adjustment');

export class InvoicesEditorRemoveAdjustmentAction implements BaseAction<InvoicesState> {
  feature = INVOICES_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: InvoiceAdjustment) {}

  handler(state: InvoicesState, action: this): InvoicesState {
    const adjustment = action.payload;
    const adjustments = state.editor.adjustments;
    const index = adjustments.indexOf(adjustment);
    const newAdjustments = [
      ...adjustments.slice(0, index),
      setStateProperties(adjustment, { isDeleted: true }),
      ...adjustments.slice(index + 1),
    ] as InvoiceAdjustment[];

    const editor = setStateProperties(state.editor, {
      adjustments: newAdjustments,
      invoice: calcDocTotals(state.editor.invoice, state.editor.products, newAdjustments),
    });
    return setStateProperties(state, { editor });
  }
}
