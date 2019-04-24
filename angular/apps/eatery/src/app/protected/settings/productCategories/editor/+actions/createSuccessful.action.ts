import { ProductCategory } from '@shared/types/productCategory.interface';
import { BaseAction, generateActionType } from '../../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { PRODUCT_CATEGORIES_STATE_FEATURE_NAME } from '../../productCategories-state.module';
import { ProductCategoriesState } from '../../productCategories.state';

const type = generateActionType(PRODUCT_CATEGORIES_STATE_FEATURE_NAME, 'Editor - Create successful');

export class ProductCategoriesEditorCreateSuccessfulAction implements BaseAction<ProductCategoriesState> {
  feature = PRODUCT_CATEGORIES_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: ProductCategory) {}

  handler(state: ProductCategoriesState, action: this): ProductCategoriesState {
    const editor = setStateProperties(state.editor, {
      isNew: true,
      isLoadingProductCategory: false,
      productCategory: action.payload,
    });
    return setStateProperties(state, { editor });
  }
}
