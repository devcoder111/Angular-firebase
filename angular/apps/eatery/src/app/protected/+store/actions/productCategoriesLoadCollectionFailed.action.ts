import { BaseAction, generateActionType } from '../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { FEATURE_NAME } from '../module';
import { ProtectedState } from '../state';

const type = generateActionType(FEATURE_NAME, 'List - Product Categories load collection failed');

export class ProductCategoriesLoadCollectionErrorAction implements BaseAction<ProtectedState> {
  feature = FEATURE_NAME;
  type = type;

  constructor(public payload: Error) {}

  handler(state: ProtectedState, action: this): ProtectedState {
    const productCategories = setStateProperties(state.productCategories, {
      loadError: action.payload,
      isLoading: false,
    });
    return setStateProperties(state, { productCategories });
  }
}
