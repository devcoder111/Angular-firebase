import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { PRODUCTS_STATE_FEATURE_NAME } from '../../products-state.module';
import { ProductsState } from '../../products.state';

const type = generateActionType(PRODUCTS_STATE_FEATURE_NAME, 'List - Load collection failed');

export class ProductsListLoadCollectionFailedAction implements BaseAction<ProductsState> {
  feature = PRODUCTS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: Error) {}

  handler(state: ProductsState, action: this): ProductsState {
    const list = setStateProperties(state.list, {
      loadError: action.payload,
      isLoading: false,
    });
    return setStateProperties(state, { list });
  }
}
