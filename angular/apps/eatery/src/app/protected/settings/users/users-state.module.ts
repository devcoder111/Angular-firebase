import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { rehydrateFeatureState } from '../../../+shared/helpers/localStorageSyncState.helper';
import { BaseAction } from '../../../+shared/helpers/state.helper';
import { UsersListStateModule } from './list/list-state.module';
import { UsersState, UsersStateInitial } from './users.state';

export const USERS_STATE_FEATURE_NAME = 'users';

const initialState = rehydrateFeatureState<UsersState>(USERS_STATE_FEATURE_NAME) || UsersStateInitial;

export function UsersReducer(state = initialState, action: BaseAction<UsersState>) {
  return action.feature === USERS_STATE_FEATURE_NAME && action.handler ? action.handler(state, action) : state;
}

@NgModule({
  imports: [
    StoreModule.forFeature(USERS_STATE_FEATURE_NAME, UsersReducer),
    EffectsModule.forFeature([
      // ...UsersEffects,
      ...UsersListStateModule.effects,
      // ...UsersEditorStateModule.effects,
    ]),
  ],
})
export class UsersStoreModule {}
