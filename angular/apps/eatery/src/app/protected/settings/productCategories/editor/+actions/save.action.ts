import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { switchMap, withLatestFrom } from 'rxjs/operators';
import { AppState } from '../../../../../+core/store/app.state';
import { BaseAction, generateActionType } from '../../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { PRODUCT_CATEGORIES_STATE_FEATURE_NAME } from '../../productCategories-state.module';
import { ProductCategoriesState } from '../../productCategories.state';
import { getProductCategoriesEditorState } from '../editor.selectors';
import { ProductCategoriesEditorState } from '../editor.state';
import { ProductCategoriesEditorSaveFailedAction } from './saveFailed.action';
import { ProductCategoriesEditorSaveSuccessfulAction } from './saveSuccessful.action';

const type = generateActionType(PRODUCT_CATEGORIES_STATE_FEATURE_NAME, 'Editor - Save');

export class ProductCategoriesEditorSaveAction implements BaseAction<ProductCategoriesState> {
  feature = PRODUCT_CATEGORIES_STATE_FEATURE_NAME;
  type = type;

  handler(state: ProductCategoriesState): ProductCategoriesState {
    const editor = setStateProperties(state.editor, {
      isSaving: true,
      saveError: null,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class ProductCategoriesEditorSaveActionEffect {
  @Effect()
  save$ = this.actions$.pipe(
    ofType(type),
    withLatestFrom(this.store, (action, state) => ({
      editor: getProductCategoriesEditorState(state),
    })),
    switchMap((data: { editor: ProductCategoriesEditorState }) => {
      const { editor } = data;
      const { id, ...model } = editor.productCategory;
      return this.db
        .doc(`${CollectionNames.productCategories}/${id}`)
        .set(model)
        .then(() => new ProductCategoriesEditorSaveSuccessfulAction())
        .catch(error => new ProductCategoriesEditorSaveFailedAction(error));
    }),
  );

  constructor(private actions$: Actions, private db: AngularFirestore, private store: Store<AppState>) {}
}
