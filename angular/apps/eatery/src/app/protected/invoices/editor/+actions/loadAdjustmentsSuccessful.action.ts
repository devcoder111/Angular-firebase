import { InvoiceAdjustment } from '@shared/types/invoiceAdjustment.interface';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { INVOICES_STATE_FEATURE_NAME } from '../../invoices-state.module';
import { InvoicesState } from '../../invoices.state';

const type = generateActionType(INVOICES_STATE_FEATURE_NAME, 'Editor - Adjustments load successful');

export class InvoicesEditorAdjustmentsLoadSuccessfulAction implements BaseAction<InvoicesState> {
  feature = INVOICES_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: InvoiceAdjustment[]) {}

  handler(state: InvoicesState, action: this): InvoicesState {
    const editor = setStateProperties(state.editor, {
      isLoadingAdjustments: false,
      adjustments: action.payload,
    });
    return setStateProperties(state, { editor });
  }
}
