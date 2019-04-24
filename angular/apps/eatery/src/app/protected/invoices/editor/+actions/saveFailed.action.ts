import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { LoggerService } from '../../../../+shared/services/logger.service';
import { INVOICES_STATE_FEATURE_NAME } from '../../invoices-state.module';
import { InvoicesState } from '../../invoices.state';

const type = generateActionType(INVOICES_STATE_FEATURE_NAME, 'Editor - Save failed');

export class InvoicesEditorSaveFailedAction implements BaseAction<InvoicesState> {
  feature = INVOICES_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: { error: Error; details: { [key: string]: any } }) {}

  handler(state: InvoicesState, action: this): InvoicesState {
    const editor = setStateProperties(state.editor, {
      isSaving: false,
      saveError: action.payload.error,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class InvoicesEditorSaveFailedActionEffect {
  @Effect({ dispatch: false })
  saveFailed$ = this.actions$.pipe(
    ofType(type),
    tap((action: InvoicesEditorSaveFailedAction) => {
      this.logger.error(
        'InvoicesEditorSaveFailedActionEffect.saveFailed$',
        action.payload.error,
        action.payload.details,
      );
      this.snackBar.open('Save doc to the DB failed. Check console for details', '', { duration: 2500 });
    }),
  );

  constructor(private actions$: Actions, private snackBar: MatSnackBar, private logger: LoggerService) {}
}
