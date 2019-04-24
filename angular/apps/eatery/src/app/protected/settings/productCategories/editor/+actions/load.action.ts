import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ProductCategory } from '@shared/types/productCategory.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap } from 'rxjs/operators';
import { unwrapDocSnapshotChanges } from '../../../../../+shared/helpers/firestore.helper';
import { BaseAction, generateActionType } from '../../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { PRODUCT_CATEGORIES_STATE_FEATURE_NAME } from '../../productCategories-state.module';
import { ProductCategoriesState } from '../../productCategories.state';
import { ProductCategoriesEditorLoadFailedAction } from './loadFailed.action';
import { ProductCategoriesEditorLoadSuccessfulAction } from './loadSuccessful.action';
import { ProductCategoriesEditorUpdateAction } from './update.action';

const type = generateActionType(PRODUCT_CATEGORIES_STATE_FEATURE_NAME, 'Editor - Load');

export class ProductCategoriesEditorItemLoadAction implements BaseAction<ProductCategoriesState> {
  feature = PRODUCT_CATEGORIES_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: string) {}

  handler(state: ProductCategoriesState): ProductCategoriesState {
    const editor = setStateProperties(state.editor, {
      isLoadingProductCategory: true,
      productCategory: null,
      loadProductCategoryError: null,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class ProductCategoriesEditorLoadActionEffect {
  @Effect()
  watchItem$ = this.actions$.pipe(
    ofType(type),
    switchMap((action: ProductCategoriesEditorItemLoadAction) =>
      this.db
        .doc<ProductCategory>(`${CollectionNames.productCategories}/${action.payload}`)
        .snapshotChanges()
        .pipe(
          map(unwrapDocSnapshotChanges),
          map(
            (item: ProductCategory, indexOfEvent: number) =>
              indexOfEvent === 0 // if first time
                ? new ProductCategoriesEditorLoadSuccessfulAction(item)
                : new ProductCategoriesEditorUpdateAction(item),
          ),
          catchError(error => of(new ProductCategoriesEditorLoadFailedAction(error))),
          // TODO for Anton: Unsubscribe when user cancel editing
        ),
    ),
  );

  constructor(private actions$: Actions, private db: AngularFirestore) {}
}
