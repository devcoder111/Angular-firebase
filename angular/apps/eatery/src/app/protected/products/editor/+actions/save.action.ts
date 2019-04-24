import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { switchMap, withLatestFrom } from 'rxjs/operators';
import { AppState } from '../../../../+core/store/app.state';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { PRODUCTS_STATE_FEATURE_NAME } from '../../products-state.module';
import { ProductsState } from '../../products.state';
import { getProductsEditorState } from '../editor.selectors';
import { ProductsEditorState } from '../editor.state';
import { ProductsEditorSaveFailedAction } from './saveFailed.action';
import { ProductsEditorSaveSuccessfulAction } from './saveSuccessful.action';

const type = generateActionType(PRODUCTS_STATE_FEATURE_NAME, 'Editor - Save');

export class ProductsEditorSaveAction implements BaseAction<ProductsState> {
  feature = PRODUCTS_STATE_FEATURE_NAME;
  type = type;

  handler(state: ProductsState): ProductsState {
    const editor = setStateProperties(state.editor, {
      isSaving: true,
      saveError: null,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class ProductsEditorSaveActionEffect {
  @Effect()
  save$ = this.actions$.pipe(
    ofType(type),
    withLatestFrom(this.store, (action, state) => ({
      editor: getProductsEditorState(state),
    })),
    switchMap((data: { editor: ProductsEditorState }) => {
      const { editor } = data;
      const { id, ...model } = editor.product;
      return this.db
        .doc(`${CollectionNames.products}/${id}`)
        .set(model)
        .then(() => new ProductsEditorSaveSuccessfulAction())
        .catch(error => new ProductsEditorSaveFailedAction(error));
    }),
  );

  constructor(private actions$: Actions, private db: AngularFirestore, private store: Store<AppState>) {}
}
