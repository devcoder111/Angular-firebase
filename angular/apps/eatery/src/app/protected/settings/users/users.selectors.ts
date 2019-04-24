import { createFeatureSelector } from '@ngrx/store';
import { USERS_STATE_FEATURE_NAME } from './users-state.module';
import { UsersState } from './users.state';

export const getUsersState = createFeatureSelector<UsersState>(USERS_STATE_FEATURE_NAME);
