import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { rehydrateFeatureState } from '../../+shared/helpers/localStorageSyncState.helper';
import { BaseAction } from '../../+shared/helpers/state.helper';
import { SuppliersEffects } from './+actions/+effects';
import { SuppliersEditorStateModule } from './editor/editor-state.module';
import { SuppliersListStateModule } from './list/list-state.module';
import { SuppliersState, SuppliersStateInitial } from './suppliers.state';

export const SUPPLIERS_STATE_FEATURE_NAME = 'organizationSuppliers';

const initialState = rehydrateFeatureState<SuppliersState>(SUPPLIERS_STATE_FEATURE_NAME) || SuppliersStateInitial;

export function SuppliersReducer(state = initialState, action: BaseAction<SuppliersState>) {
  return action.feature === SUPPLIERS_STATE_FEATURE_NAME && action.handler ? action.handler(state, action) : state;
}

@NgModule({
  imports: [
    StoreModule.forFeature(SUPPLIERS_STATE_FEATURE_NAME, SuppliersReducer),
    EffectsModule.forFeature([
      ...SuppliersEffects,
      ...SuppliersListStateModule.effects,
      ...SuppliersEditorStateModule.effects,
    ]),
  ],
})
export class SuppliersStoreModule {}
