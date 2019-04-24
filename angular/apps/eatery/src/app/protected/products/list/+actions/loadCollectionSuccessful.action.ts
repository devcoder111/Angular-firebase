import { OrganizationProduct } from '@shared/types/organizationProduct.interface';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { PRODUCTS_STATE_FEATURE_NAME } from '../../products-state.module';
import { ProductsState } from '../../products.state';

const type = generateActionType(PRODUCTS_STATE_FEATURE_NAME, 'List - Load collection successful');

export class ProductsListLoadCollectionSuccessfulAction implements BaseAction<ProductsState> {
  feature = PRODUCTS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: OrganizationProduct[]) {}

  handler(state: ProductsState, action: this): ProductsState {
    const list = setStateProperties(state.list, {
      ids: action.payload.map(item => item.id),
      map: action.payload.reduce((items, item) => ({ ...items, [item.id]: item }), {}),
      isLoading: false,
      loadError: null,
    });
    return setStateProperties(state, { list });
  }
}
