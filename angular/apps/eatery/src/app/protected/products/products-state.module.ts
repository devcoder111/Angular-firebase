import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { rehydrateFeatureState } from '../../+shared/helpers/localStorageSyncState.helper';
import { BaseAction } from '../../+shared/helpers/state.helper';
import { ProductsEffects } from './+actions/+effects';
import { ProductsEditorStateModule } from './editor/editor-state.module';
import { ProductsListStateModule } from './list/list-state.module';
import { ProductsState, ProductsStateInitial } from './products.state';

export const PRODUCTS_STATE_FEATURE_NAME = 'organizationProducts';

const initialState = rehydrateFeatureState<ProductsState>(PRODUCTS_STATE_FEATURE_NAME) || ProductsStateInitial;

export function ProductsReducer(state = initialState, action: BaseAction<ProductsState>) {
  return action.feature === PRODUCTS_STATE_FEATURE_NAME && action.handler ? action.handler(state, action) : state;
}

@NgModule({
  imports: [
    StoreModule.forFeature(PRODUCTS_STATE_FEATURE_NAME, ProductsReducer),
    EffectsModule.forFeature([
      ...ProductsEffects,
      ...ProductsListStateModule.effects,
      ...ProductsEditorStateModule.effects,
    ]),
  ],
})
export class ProductsStoreModule {}
