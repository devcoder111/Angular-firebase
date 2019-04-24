import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { rehydrateFeatureState } from '../../+shared/helpers/localStorageSyncState.helper';
import { BaseAction } from '../../+shared/helpers/state.helper';
import { LocationsSetCollectionActionEffect } from './actions/locationsListSetCollection.action';
import { LocationsSetActiveItemIdActionEffect } from './actions/locationsSetActiveItemId.action';
import { UserAuthenticatedActionEffect } from './actions/userAuthenticated.action';
import { UserConfigLoadedActionEffect } from './actions/userConfigLoaded.action';
import { UserProfileLoadedActionEffect } from './actions/userProfileLoaded.action';
import { UserSignedOutActionEffect } from './actions/userSignedOut.action';
import { UserEmailActionsActionEffect } from './actions/userEmailActions.action';
import { AppMetaReducers, AppReducers } from './app.reducer';
import { CoreState, CoreStateInitial } from './core.state';
import { UserSetPasswordActionEffect } from './actions/userSetPassword.action';
import { ClearAuthErrorActionEffect } from './actions/clearAuthError.Action';

export const FEATURE_NAME = 'core';

export const CoreInitialStateRehydrated = rehydrateFeatureState<CoreState>(FEATURE_NAME) || CoreStateInitial;

export function CoreReducer(state = CoreInitialStateRehydrated, action: BaseAction<CoreState>) {
  return action.feature === FEATURE_NAME && action.handler ? action.handler(state, action) : state;
}

@NgModule({
  imports: [
    StoreModule.forRoot(AppReducers, {
      metaReducers: AppMetaReducers,
    }),
    EffectsModule.forRoot([]),
    StoreModule.forFeature(FEATURE_NAME, CoreReducer),
    EffectsModule.forFeature([
      UserAuthenticatedActionEffect,
      UserConfigLoadedActionEffect,
      UserProfileLoadedActionEffect,
      UserSignedOutActionEffect,
      LocationsSetCollectionActionEffect,
      LocationsSetActiveItemIdActionEffect,
      UserEmailActionsActionEffect,
      UserSetPasswordActionEffect,
      ClearAuthErrorActionEffect,
    ]),
  ],
})
export class CoreStoreModule {}
