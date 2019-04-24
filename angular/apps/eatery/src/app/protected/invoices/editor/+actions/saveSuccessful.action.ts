import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { INVOICES_STATE_FEATURE_NAME } from '../../invoices-state.module';
import { InvoicesState } from '../../invoices.state';

const type = generateActionType(INVOICES_STATE_FEATURE_NAME, 'Editor - Save successful');

export class InvoicesEditorSaveSuccessfulAction implements BaseAction<InvoicesState> {
  feature = INVOICES_STATE_FEATURE_NAME;
  type = type;

  handler(state: InvoicesState): InvoicesState {
    const editor = setStateProperties(state.editor, {
      isSaving: false,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class InvoicesEditorSaveSuccessfulActionEffect {
  @Effect({ dispatch: false })
  saveSuccessful$ = this.actions$.pipe(
    ofType(type),
    tap(() => {
      this.snackBar.open('Invoice was saved', null, { duration: 2500 });
      // noinspection JSIgnoredPromiseFromCall
      this.router.navigate(['/invoices']);
    }),
  );

  constructor(private actions$: Actions, private snackBar: MatSnackBar, private router: Router) {}
}
