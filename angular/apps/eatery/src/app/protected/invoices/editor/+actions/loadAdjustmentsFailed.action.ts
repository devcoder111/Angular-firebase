import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { LoggerService } from '../../../../+shared/services/logger.service';
import { INVOICES_STATE_FEATURE_NAME } from '../../invoices-state.module';
import { InvoicesState } from '../../invoices.state';

const type = generateActionType(INVOICES_STATE_FEATURE_NAME, 'Editor - Load adjustments failed');

export class InvoicesEditorLoadAdjustmentsFailedAction implements BaseAction<InvoicesState> {
  feature = INVOICES_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: Error) {}

  handler(state: InvoicesState, action: this): InvoicesState {
    const editor = setStateProperties(state.editor, {
      isLoadingAdjustments: false,
      loadAdjustmentsError: action.payload,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class InvoicesEditorLoadAdjustmentsFailedActionEffect {
  @Effect()
  logError$ = this.actions$.pipe(
    ofType(type),
    tap((action: InvoicesEditorLoadAdjustmentsFailedAction) => {
      this.logger.error('InvoicesEditorLoadAdjustmentsFailedActionEffect.logError$', action.payload);
    }),
  );

  constructor(private actions$: Actions, private logger: LoggerService) {}
}
