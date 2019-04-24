import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { LoggerService } from '../../../../+shared/services/logger.service';
import { INVOICES_STATE_FEATURE_NAME } from '../../invoices-state.module';
import { InvoicesState } from '../../invoices.state';

const type = generateActionType(INVOICES_STATE_FEATURE_NAME, 'Editor - Load invoice failed');

export class InvoicesEditorLoadInvoiceFailedAction implements BaseAction<InvoicesState> {
  feature = INVOICES_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: Error) {}

  handler(state: InvoicesState, action: this): InvoicesState {
    const editor = setStateProperties(state.editor, {
      isLoadingInvoice: false,
      loadInvoiceError: action.payload,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class InvoicesEditorLoadFailedActionEffect {
  @Effect()
  logError$ = this.actions$.pipe(
    ofType(type),
    tap((action: InvoicesEditorLoadInvoiceFailedAction) => {
      this.logger.error('InvoicesEditorLoadFailedActionEffect.logError$', action.payload);
    }),
  );

  constructor(private actions$: Actions, private logger: LoggerService) {}
}
