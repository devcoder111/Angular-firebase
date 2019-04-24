import { BaseAction, generateActionType } from '../../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { PRODUCT_CATEGORIES_STATE_FEATURE_NAME } from '../../productCategories-state.module';
import { ProductCategoriesState } from '../../productCategories.state';

const type = generateActionType(PRODUCT_CATEGORIES_STATE_FEATURE_NAME, 'List - Load collection failed');

export class ProductCategoriesListLoadCollectionFailedAction implements BaseAction<ProductCategoriesState> {
  feature = PRODUCT_CATEGORIES_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: Error) {}

  handler(state: ProductCategoriesState, action: this): ProductCategoriesState {
    const list = setStateProperties(state.list, {
      loadError: action.payload,
      isLoading: false,
    });
    return setStateProperties(state, { list });
  }
}
