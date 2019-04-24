import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { OrganizationProduct } from '@shared/types/organizationProduct.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { of } from 'rxjs/observable/of';
import { catchError, combineLatest as combineLatestOp, map, switchMap } from 'rxjs/operators';
import { AppState } from '../../../../+core/store/app.state';
import { getActiveOrganizationId } from '../../../../+core/store/selectors';
import {
  firestoreQueryStringStartsWith,
  unwrapCollectionSnapshotChanges,
} from '../../../../+shared/helpers/firestore.helper';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { PRODUCTS_STATE_FEATURE_NAME } from '../../products-state.module';
import { ProductsState } from '../../products.state';
import { getProductsListFilter } from '../list.selectors';
import { ProductsListFilter } from '../listFilter.interface';
import { ProductsListLoadCollectionFailedAction } from './loadCollectionFailed.action';
import { ProductsListLoadCollectionSuccessfulAction } from './loadCollectionSuccessful.action';

const type = generateActionType(PRODUCTS_STATE_FEATURE_NAME, 'List - Load collection');

export class ProductsListLoadCollectionAction implements BaseAction<ProductsState> {
  feature = PRODUCTS_STATE_FEATURE_NAME;
  type = type;

  handler(state: ProductsState): ProductsState {
    const list = setStateProperties(state.list, {
      isLoading: true,
      loadError: null,
    });
    return setStateProperties(state, { list });
  }
}

@Injectable()
export class ProductsListLoadCollectionActionEffect {
  @Effect()
  watchProducts$ = this.actions$.pipe(
    ofType(type),
    combineLatestOp(
      this.store.pipe(select(getActiveOrganizationId)),
      this.store.pipe(select(getProductsListFilter)), // triggers if productsListFilter was changed
      (action, organizationId, productsListFilter) => ({
        organizationId,
        productsListFilter,
      }),
    ),
    switchMap((data: { organizationId: string; productsListFilter: ProductsListFilter }) =>
      this.db
        .collection<OrganizationProduct>(`${CollectionNames.products}`, ref => {
          let query = ref.limit(20).where('organizationId', '==', data.organizationId);
          if (data.productsListFilter.name) {
            const field = 'name';
            query = firestoreQueryStringStartsWith(query, field, data.productsListFilter.name).orderBy(field);
          }
          query = query.orderBy('createdAt', 'desc');
          return query;
        })
        .snapshotChanges()
        .pipe(map(unwrapCollectionSnapshotChanges)),
    ),
    map((items: OrganizationProduct[]) => new ProductsListLoadCollectionSuccessfulAction(items)),
    catchError(error => of(new ProductsListLoadCollectionFailedAction(error))),
    // TODO for Anton: Unsubscribe when user leaves /products
  );

  constructor(private actions$: Actions, private store: Store<AppState>, private db: AngularFirestore) {}
}
