import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { rehydrateFeatureState } from '../../+shared/helpers/localStorageSyncState.helper';
import { BaseAction } from '../../+shared/helpers/state.helper';
import { OrdersEffects } from './+actions/+effects';
import { OrdersEditorStateModule } from './editor/editor-state.module';
import { OrdersListStateModule } from './list/list-state.module';
import { OrdersState, OrdersStateInitial } from './orders.state';

export const ORDERS_STATE_FEATURE_NAME = 'orders';

const initialState = rehydrateFeatureState<OrdersState>(ORDERS_STATE_FEATURE_NAME) || OrdersStateInitial;

export function OrdersReducer(state = initialState, action: BaseAction<OrdersState>) {
  return action.feature === ORDERS_STATE_FEATURE_NAME && action.handler ? action.handler(state, action) : state;
}

@NgModule({
  imports: [
    StoreModule.forFeature(ORDERS_STATE_FEATURE_NAME, OrdersReducer),
    EffectsModule.forFeature([...OrdersEffects, ...OrdersListStateModule.effects, ...OrdersEditorStateModule.effects]),
  ],
})
export class OrdersStoreModule {}
