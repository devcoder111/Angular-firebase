import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { rehydrateFeatureState } from '../../+shared/helpers/localStorageSyncState.helper';
import { BaseAction } from '../../+shared/helpers/state.helper';
import { InvoicesEffects } from './+actions/+effects';
import { InvoicesEditorStateModule } from './editor/editor-state.module';
import { InvoicesState, InvoicesStateInitial } from './invoices.state';
import { InvoicesListStateModule } from './list/list-state.module';

export const INVOICES_STATE_FEATURE_NAME = 'invoices';

const initialState = rehydrateFeatureState<InvoicesState>(INVOICES_STATE_FEATURE_NAME) || InvoicesStateInitial;

export function InvoicesReducer(state = initialState, action: BaseAction<InvoicesState>) {
  return action.feature === INVOICES_STATE_FEATURE_NAME && action.handler ? action.handler(state, action) : state;
}

@NgModule({
  imports: [
    StoreModule.forFeature(INVOICES_STATE_FEATURE_NAME, InvoicesReducer),
    EffectsModule.forFeature([
      ...InvoicesEffects,
      ...InvoicesListStateModule.effects,
      ...InvoicesEditorStateModule.effects,
    ]),
  ],
})
export class InvoicesStoreModule {}
