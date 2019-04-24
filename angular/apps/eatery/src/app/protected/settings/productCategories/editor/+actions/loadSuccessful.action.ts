import { ProductCategory } from '@shared/types/productCategory.interface';
import { BaseAction, generateActionType } from '../../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { PRODUCT_CATEGORIES_STATE_FEATURE_NAME } from '../../productCategories-state.module';
import { ProductCategoriesState } from '../../productCategories.state';

const type = generateActionType(PRODUCT_CATEGORIES_STATE_FEATURE_NAME, 'Editor - Load successful');

export class ProductCategoriesEditorLoadSuccessfulAction implements BaseAction<ProductCategoriesState> {
  feature = PRODUCT_CATEGORIES_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: ProductCategory) {}

  handler(state: ProductCategoriesState, action: this): ProductCategoriesState {
    const editor = setStateProperties(state.editor, {
      isLoadingProductCategory: false,
      loadProductCategoryError: null,
      productCategory: action.payload,
      isNew: false,
    });
    return setStateProperties(state, { editor });
  }
}
