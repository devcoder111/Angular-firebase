import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { SUPPLIERS_STATE_FEATURE_NAME } from '../../suppliers-state.module';
import { SuppliersState } from '../../suppliers.state';

const type = generateActionType(SUPPLIERS_STATE_FEATURE_NAME, 'Editor - Save successful');

export class SuppliersEditorSaveSuccessfulAction implements BaseAction<SuppliersState> {
  feature = SUPPLIERS_STATE_FEATURE_NAME;
  type = type;

  handler(state: SuppliersState): SuppliersState {
    const editor = setStateProperties(state.editor, {
      isSaving: false,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class SuppliersEditorSaveSuccessfulActionEffect {
  @Effect({ dispatch: false })
  saveSuccessful$ = this.actions$.pipe(
    ofType(type),
    tap(() => {
      this.snackBar.open(`Supplier was saved`, null, {
        duration: 2500,
      });
      // noinspection JSIgnoredPromiseFromCall
      this.router.navigate(['/suppliers']);
    }),
  );

  constructor(private actions$: Actions, private snackBar: MatSnackBar, private router: Router) {}
}
