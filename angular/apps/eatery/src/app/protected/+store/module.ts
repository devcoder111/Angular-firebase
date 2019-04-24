import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { OrganizationsLoadDataForActiveOneActionEffect } from '../../+core/store/actions/organizationsLoadDataForOne.action';
import { OrganizationsSetActiveItemIdActionEffect } from '../../+core/store/actions/organizationsSetActiveItemId.action';
import { OrganizationsSetCollectionActionEffect } from '../../+core/store/actions/organizationsSetCollection.action';
import { rehydrateFeatureState } from '../../+shared/helpers/localStorageSyncState.helper';
import { BaseAction } from '../../+shared/helpers/state.helper';
import { ProtectedInitActionEffect } from './actions/init.action';
import { UISetDeviceTypeActionEffect } from './actions/uiSetDeviceType.action';
import { ProtectedState, ProtectedStateInitial } from './state';

export const FEATURE_NAME = 'protected';

const initialState = rehydrateFeatureState<ProtectedState>(FEATURE_NAME) || ProtectedStateInitial;

export function ProtectedReducer(state = initialState, action: BaseAction<ProtectedState>) {
  return action.feature === FEATURE_NAME && action.handler ? action.handler(state, action) : state;
}

@NgModule({
  imports: [
    StoreModule.forFeature(FEATURE_NAME, ProtectedReducer),
    EffectsModule.forFeature([
      ProtectedInitActionEffect,
      OrganizationsSetCollectionActionEffect,
      OrganizationsSetActiveItemIdActionEffect,
      OrganizationsLoadDataForActiveOneActionEffect,
      UISetDeviceTypeActionEffect,
    ]),
  ],
})
export class ProtectedStoreModule {}
