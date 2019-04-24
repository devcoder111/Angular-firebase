import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { LoggerService } from '../../../../+shared/services/logger.service';
import { PRODUCTS_STATE_FEATURE_NAME } from '../../products-state.module';
import { ProductsState } from '../../products.state';

const type = generateActionType(PRODUCTS_STATE_FEATURE_NAME, 'Editor - Save failed');

export class ProductsEditorSaveFailedAction implements BaseAction<ProductsState> {
  feature = PRODUCTS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: Error) {}

  handler(state: ProductsState, action: this): ProductsState {
    const editor = setStateProperties(state.editor, {
      isSaving: false,
      saveError: action.payload,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class ProductsEditorSaveFailedActionEffect {
  @Effect({ dispatch: false })
  saveFailed$ = this.actions$.pipe(
    ofType(type),
    tap((action: ProductsEditorSaveFailedAction) => {
      this.logger.error('ProductsEditorSaveFailedActionEffect.saveFailed$', action.payload);
      this.snackBar.open(`Product save failed`, null, {
        duration: 2500,
      });
    }),
  );

  constructor(private actions$: Actions, private snackBar: MatSnackBar, private logger: LoggerService) {}
}
