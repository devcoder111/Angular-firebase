import { InvoiceProduct } from '@shared/types/invoiceProduct.interface';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { INVOICES_STATE_FEATURE_NAME } from '../../invoices-state.module';
import { InvoicesState } from '../../invoices.state';

const type = generateActionType(INVOICES_STATE_FEATURE_NAME, 'Editor - Products load successful');

export class InvoicesEditorProductsLoadSuccessfulAction implements BaseAction<InvoicesState> {
  feature = INVOICES_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: InvoiceProduct[]) {}

  handler(state: InvoicesState, action: this): InvoicesState {
    const editor = setStateProperties(state.editor, {
      isLoadingProducts: false,
      products: action.payload,
    });
    return setStateProperties(state, { editor });
  }
}
