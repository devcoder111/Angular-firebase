import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { PRODUCTS_STATE_FEATURE_NAME } from '../../products-state.module';
import { ProductsState } from '../../products.state';

const type = generateActionType(PRODUCTS_STATE_FEATURE_NAME, 'Editor - Save successful');

export class ProductsEditorSaveSuccessfulAction implements BaseAction<ProductsState> {
  feature = PRODUCTS_STATE_FEATURE_NAME;
  type = type;

  handler(state: ProductsState): ProductsState {
    const editor = setStateProperties(state.editor, {
      isSaving: false,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class ProductsEditorSaveSuccessfulActionEffect {
  @Effect({ dispatch: false })
  saveSuccessful$ = this.actions$.pipe(
    ofType(type),
    tap(() => {
      this.snackBar.open(`Product was saved`, null, {
        duration: 2500,
      });
      // noinspection JSIgnoredPromiseFromCall
      this.router.navigate(['/products']);
    }),
  );

  constructor(private actions$: Actions, private snackBar: MatSnackBar, private router: Router) {}
}
