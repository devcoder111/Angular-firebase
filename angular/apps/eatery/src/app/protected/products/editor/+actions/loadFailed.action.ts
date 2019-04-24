import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { LoggerService } from '../../../../+shared/services/logger.service';
import { PRODUCTS_STATE_FEATURE_NAME } from '../../products-state.module';
import { ProductsState } from '../../products.state';

const type = generateActionType(PRODUCTS_STATE_FEATURE_NAME, 'Editor - Load product failed');

export class ProductsEditorLoadProductFailedAction implements BaseAction<ProductsState> {
  feature = PRODUCTS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: Error) {}

  handler(state: ProductsState, action: this): ProductsState {
    const editor = setStateProperties(state.editor, {
      isLoadingProduct: false,
      loadProductError: action.payload,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class ProductsEditorLoadProductFailedActionEffect {
  @Effect()
  logError$ = this.actions$.pipe(
    ofType(type),
    tap((action: ProductsEditorLoadProductFailedAction) => {
      this.logger.error('ProductsEditorLoadProductFailedActionEffect.logError$: ', action.payload);
    }),
  );

  constructor(private actions$: Actions, private logger: LoggerService) {}
}
