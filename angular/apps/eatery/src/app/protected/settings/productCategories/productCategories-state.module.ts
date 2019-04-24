import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { rehydrateFeatureState } from '../../../+shared/helpers/localStorageSyncState.helper';
import { BaseAction } from '../../../+shared/helpers/state.helper';
import { ProductCategoriesEditorStateModule } from './editor/editor-state.module';
import { ProductCategoriesListStateModule } from './list/list-state.module';
import { ProductCategoriesState, ProductCategoriesStateInitial } from './productCategories.state';

export const PRODUCT_CATEGORIES_STATE_FEATURE_NAME = 'productCategories';

const initialState =
  rehydrateFeatureState<ProductCategoriesState>(PRODUCT_CATEGORIES_STATE_FEATURE_NAME) || ProductCategoriesStateInitial;

export function ProductsCategoriesReducer(state = initialState, action: BaseAction<ProductCategoriesState>) {
  return action.feature === PRODUCT_CATEGORIES_STATE_FEATURE_NAME && action.handler
    ? action.handler(state, action)
    : state;
}

@NgModule({
  imports: [
    StoreModule.forFeature(PRODUCT_CATEGORIES_STATE_FEATURE_NAME, ProductsCategoriesReducer),
    EffectsModule.forFeature([
      ...ProductCategoriesListStateModule.effects,
      ...ProductCategoriesEditorStateModule.effects,
    ]),
  ],
})
export class ProductCategoriesStoreModule {}
