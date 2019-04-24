import { createFeatureSelector } from '@ngrx/store';
import { OnboardingState } from './onboarding.state';
import { FEATURE_NAME } from './onboarding.state.module';

export const getOnboardingState = createFeatureSelector<OnboardingState>(FEATURE_NAME);
