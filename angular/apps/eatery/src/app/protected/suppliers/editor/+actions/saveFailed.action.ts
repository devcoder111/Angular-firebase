import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { LoggerService } from '../../../../+shared/services/logger.service';
import { SUPPLIERS_STATE_FEATURE_NAME } from '../../suppliers-state.module';
import { SuppliersState } from '../../suppliers.state';

const type = generateActionType(SUPPLIERS_STATE_FEATURE_NAME, 'Editor - Save failed');

export class SuppliersEditorSaveFailedAction implements BaseAction<SuppliersState> {
  feature = SUPPLIERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: Error) {}

  handler(state: SuppliersState, action: this): SuppliersState {
    const editor = setStateProperties(state.editor, {
      isSaving: false,
      saveError: action.payload,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class SuppliersEditorSaveFailedActionEffect {
  @Effect({ dispatch: false })
  saveFailed$ = this.actions$.pipe(
    ofType(type),
    tap((action: SuppliersEditorSaveFailedAction) => {
      this.logger.error('SuppliersEditorSaveFailedActionEffect.saveFailed$', action.payload);
      this.snackBar.open(`Supplier save failed`, null, {
        duration: 2500,
      });
    }),
  );

  constructor(private actions$: Actions, private snackBar: MatSnackBar, private logger: LoggerService) {}
}
