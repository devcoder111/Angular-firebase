import { BaseAction, generateActionType } from '../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { ProductCategory } from '@shared/types/productCategory.interface';
import { FEATURE_NAME } from '../module';
import { ProtectedState } from '../state';

const type = generateActionType(FEATURE_NAME, 'Product Categories - Set collection');

export class ProductCategoriesSetCollectionAction implements BaseAction<ProtectedState> {
  feature = FEATURE_NAME;
  type = type;

  constructor(public payload: ProductCategory[]) {}

  handler(state: ProtectedState, action: this): ProtectedState {
    const productCategories = setStateProperties(state.productCategories, {
      ids: action.payload.map(item => item.id),
      items: action.payload.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {}),
    });
    return setStateProperties(state, { productCategories });
  }
}
