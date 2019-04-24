import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { BaseAction, generateActionType } from '../../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { LoggerService } from '../../../../../+shared/services/logger.service';
import { PRODUCT_CATEGORIES_STATE_FEATURE_NAME } from '../../productCategories-state.module';
import { ProductCategoriesState } from '../../productCategories.state';

const type = generateActionType(PRODUCT_CATEGORIES_STATE_FEATURE_NAME, 'Editor - Save failed');

export class ProductCategoriesEditorSaveFailedAction implements BaseAction<ProductCategoriesState> {
  feature = PRODUCT_CATEGORIES_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: Error) {}

  handler(state: ProductCategoriesState, action: this): ProductCategoriesState {
    const editor = setStateProperties(state.editor, {
      isSaving: false,
      saveError: action.payload,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class ProductCategoriesEditorSaveFailedActionEffect {
  @Effect({ dispatch: false })
  saveFailed$ = this.actions$.pipe(
    ofType(type),
    tap((action: ProductCategoriesEditorSaveFailedAction) => {
      this.logger.error('ProductCategoriesEditorSaveFailedActionEffect.saveFailed$', action.payload);
      this.snackBar.open(`Product category save failed`, null, {
        duration: 2500,
      });
    }),
  );

  constructor(private actions$: Actions, private snackBar: MatSnackBar, private logger: LoggerService) {}
}
