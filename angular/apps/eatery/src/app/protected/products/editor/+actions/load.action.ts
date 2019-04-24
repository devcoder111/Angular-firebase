import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { OrganizationProduct } from '@shared/types/organizationProduct.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AppState } from '../../../../+core/store/app.state';
import { unwrapDocSnapshotChanges } from '../../../../+shared/helpers/firestore.helper';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { PRODUCTS_STATE_FEATURE_NAME } from '../../products-state.module';
import { ProductsState } from '../../products.state';
import { ProductsEditorLoadProductFailedAction } from './loadFailed.action';
import { ProductsEditorLoadSuccessfulAction } from './loadSuccessful.action';
import { ProductsEditorUpdateAction } from './update.action';

const type = generateActionType(PRODUCTS_STATE_FEATURE_NAME, 'Editor - Load');

export class ProductsEditorItemLoadAction implements BaseAction<ProductsState> {
  feature = PRODUCTS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: string) {}

  handler(state: ProductsState): ProductsState {
    const editor = setStateProperties(state.editor, {
      isLoadingProduct: true,
      product: null,
      loadProductError: null,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class ProductsEditorLoadActionEffect {
  @Effect()
  watchItem$ = this.actions$.pipe(
    ofType(type),
    switchMap((action: ProductsEditorItemLoadAction) =>
      this.db
        .doc<OrganizationProduct>(`${CollectionNames.products}/${action.payload}`)
        .snapshotChanges()
        .pipe(
          map(unwrapDocSnapshotChanges),
          map(
            (item: OrganizationProduct, indexOfEvent: number) =>
              indexOfEvent === 0 // if first time
                ? new ProductsEditorLoadSuccessfulAction(item)
                : new ProductsEditorUpdateAction(item),
          ),
          catchError(error => of(new ProductsEditorLoadProductFailedAction(error))),
          // TODO for Anton: Unsubscribe when user leaves /products/:id
        ),
    ),
  );

  constructor(private actions$: Actions, private store: Store<AppState>, private db: AngularFirestore) {}
}
