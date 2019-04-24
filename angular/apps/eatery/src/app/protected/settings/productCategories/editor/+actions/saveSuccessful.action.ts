import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { BaseAction, generateActionType } from '../../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { PRODUCT_CATEGORIES_STATE_FEATURE_NAME } from '../../productCategories-state.module';
import { ProductCategoriesState } from '../../productCategories.state';

const type = generateActionType(PRODUCT_CATEGORIES_STATE_FEATURE_NAME, 'Editor - Save successful');

export class ProductCategoriesEditorSaveSuccessfulAction implements BaseAction<ProductCategoriesState> {
  feature = PRODUCT_CATEGORIES_STATE_FEATURE_NAME;
  type = type;

  handler(state: ProductCategoriesState): ProductCategoriesState {
    const editor = setStateProperties(state.editor, {
      isSaving: false,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class ProductCategoriesEditorSaveSuccessfulActionEffect {
  @Effect({ dispatch: false })
  saveSuccessful$ = this.actions$.pipe(
    ofType(type),
    tap(() => {
      this.snackBar.open(`Product category was saved`, null, {
        duration: 2500,
      });
      // noinspection JSIgnoredPromiseFromCall
      this.router.navigate(['/settings/product-categories']);
    }),
  );

  constructor(private actions$: Actions, private snackBar: MatSnackBar, private router: Router) {}
}
