import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { rehydrateFeatureState } from '../+shared/helpers/localStorageSyncState.helper';
import { BaseAction } from '../+shared/helpers/state.helper';
import { OnboardingState, OnboardingStateInitial } from './onboarding.state';

export const FEATURE_NAME = 'onboarding';

const initialState = rehydrateFeatureState<OnboardingState>(FEATURE_NAME) || OnboardingStateInitial;

export function OnboardingReducer(state = initialState, action: BaseAction<OnboardingState>) {
  return action.feature === FEATURE_NAME && action.handler ? action.handler(state, action) : state;
}

@NgModule({
  imports: [StoreModule.forFeature(FEATURE_NAME, OnboardingReducer), EffectsModule.forFeature([])],
})
export class OnboardingStoreModule {}
