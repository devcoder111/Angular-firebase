import { ProductCategory } from '@shared/types/productCategory.interface';
import { BaseAction, generateActionType } from '../../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { PRODUCT_CATEGORIES_STATE_FEATURE_NAME } from '../../productCategories-state.module';
import { ProductCategoriesState } from '../../productCategories.state';

const type = generateActionType(PRODUCT_CATEGORIES_STATE_FEATURE_NAME, 'List - Load collection successful');

export class ProductCategoriesListLoadCollectionSuccessfulAction implements BaseAction<ProductCategoriesState> {
  feature = PRODUCT_CATEGORIES_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: ProductCategory[]) {}

  handler(state: ProductCategoriesState, action: this): ProductCategoriesState {
    const list = setStateProperties(state.list, {
      ids: action.payload.map(item => item.id),
      map: action.payload.reduce((items, item) => ({ ...items, [item.id]: item }), {}),
      isLoading: false,
      loadError: null,
    });
    return setStateProperties(state, { list });
  }
}
