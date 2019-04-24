import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { PRODUCTS_STATE_FEATURE_NAME } from '../../products-state.module';
import { ProductsState } from '../../products.state';
import { ProductsListFilter } from '../listFilter.interface';

const type = generateActionType(PRODUCTS_STATE_FEATURE_NAME, 'List - Set filter');

export class ProductsListSetFilterAction implements BaseAction<ProductsState> {
  feature = PRODUCTS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: ProductsListFilter) {}

  handler(state: ProductsState, action: this): ProductsState {
    const list = setStateProperties(state.list, {
      filter: action.payload,
    });
    return setStateProperties(state, { list });
  }
}
