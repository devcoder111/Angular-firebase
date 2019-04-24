import { BaseAction, generateActionType } from '../../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { PRODUCT_CATEGORIES_STATE_FEATURE_NAME } from '../../productCategories-state.module';
import { ProductCategoriesState } from '../../productCategories.state';
import { ProductCategoriesListFilter } from '../listFilter.interface';

const type = generateActionType(PRODUCT_CATEGORIES_STATE_FEATURE_NAME, 'List - Set filter');

export class ProductCategoriesListSetFilterAction implements BaseAction<ProductCategoriesState> {
  feature = PRODUCT_CATEGORIES_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: ProductCategoriesListFilter) {}

  handler(state: ProductCategoriesState, action: this): ProductCategoriesState {
    const list = setStateProperties(state.list, {
      filter: action.payload,
    });
    return setStateProperties(state, { list });
  }
}
