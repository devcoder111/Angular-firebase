import { calcDocTotals } from '@shared/helpers/taxes/taxes.helper';
import { InvoiceProduct } from '@shared/types/invoiceProduct.interface';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { INVOICES_STATE_FEATURE_NAME } from '../../invoices-state.module';
import { InvoicesState } from '../../invoices.state';

const type = generateActionType(INVOICES_STATE_FEATURE_NAME, 'Remove product');

export class InvoicesEditorRemoveProductAction implements BaseAction<InvoicesState> {
  feature = INVOICES_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: InvoiceProduct) {}

  handler(state: InvoicesState, action: this): InvoicesState {
    const product = action.payload;
    const products = state.editor.products;
    const index = products.indexOf(product);
    const newProducts = [
      ...products.slice(0, index),
      setStateProperties(product, { isDeleted: true }),
      ...products.slice(index + 1),
    ] as InvoiceProduct[];

    const editor = setStateProperties(state.editor, {
      products: newProducts,
      invoice: calcDocTotals(state.editor.invoice, newProducts, state.editor.adjustments),
    });
    return setStateProperties(state, { editor });
  }
}
