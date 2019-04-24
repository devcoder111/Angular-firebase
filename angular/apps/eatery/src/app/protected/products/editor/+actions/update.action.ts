import { OrganizationProduct } from '@shared/types/organizationProduct.interface';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { PRODUCTS_STATE_FEATURE_NAME } from '../../products-state.module';
import { ProductsState } from '../../products.state';

const type = generateActionType(PRODUCTS_STATE_FEATURE_NAME, 'Editor - Update');

export class ProductsEditorUpdateAction implements BaseAction<ProductsState> {
  feature = PRODUCTS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: Partial<OrganizationProduct>) {}

  handler(state: ProductsState, action: this): ProductsState {
    const product = setStateProperties(state.editor.product, {
      ...action.payload,
    });
    const editor = setStateProperties(state.editor, { product });
    return setStateProperties(state, { editor });
  }
}
