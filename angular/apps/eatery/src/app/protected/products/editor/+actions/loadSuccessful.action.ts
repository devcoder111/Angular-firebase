import { OrganizationProduct } from '@shared/types/organizationProduct.interface';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { PRODUCTS_STATE_FEATURE_NAME } from '../../products-state.module';
import { ProductsState } from '../../products.state';

const type = generateActionType(PRODUCTS_STATE_FEATURE_NAME, 'Editor - Load successful');

export class ProductsEditorLoadSuccessfulAction implements BaseAction<ProductsState> {
  feature = PRODUCTS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: OrganizationProduct) {}

  handler(state: ProductsState, action: this): ProductsState {
    const editor = setStateProperties(state.editor, {
      isLoadingProduct: false,
      loadProductError: null,
      product: action.payload,
      isNew: false,
    });
    return setStateProperties(state, { editor });
  }
}
