import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { BaseAction, generateActionType } from '../../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { LoggerService } from '../../../../../+shared/services/logger.service';
import { PRODUCT_CATEGORIES_STATE_FEATURE_NAME } from '../../productCategories-state.module';
import { ProductCategoriesState } from '../../productCategories.state';

const type = generateActionType(PRODUCT_CATEGORIES_STATE_FEATURE_NAME, 'Editor - Load product category failed');

export class ProductCategoriesEditorLoadFailedAction implements BaseAction<ProductCategoriesState> {
  feature = PRODUCT_CATEGORIES_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: Error) {}

  handler(state: ProductCategoriesState, action: this): ProductCategoriesState {
    const editor = setStateProperties(state.editor, {
      isLoadingProductCategory: false,
      loadProductCategoryError: action.payload,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class ProductCategoriesEditorLoadFailedActionEffect {
  @Effect()
  logError$ = this.actions$.pipe(
    ofType(type),
    tap((action: ProductCategoriesEditorLoadFailedAction) => {
      this.logger.error('ProductCategoriesEditorLoadFailedActionEffect.logError$', action.payload);
    }),
  );

  constructor(private actions$: Actions, private logger: LoggerService) {}
}
