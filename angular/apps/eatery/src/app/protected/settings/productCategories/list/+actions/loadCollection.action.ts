import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { ProductCategory } from '@shared/types/productCategory.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { of } from 'rxjs/observable/of';
import { catchError, combineLatest as combineLatestOp, filter, map, switchMap } from 'rxjs/operators';
import { AppState } from '../../../../../+core/store/app.state';

import { getActiveOrganizationId } from '../../../../../+core/store/selectors';
import { unwrapCollectionSnapshotChanges } from '../../../../../+shared/helpers/firestore.helper';
import { BaseAction, generateActionType } from '../../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { PRODUCT_CATEGORIES_STATE_FEATURE_NAME } from '../../productCategories-state.module';
import { ProductCategoriesState } from '../../productCategories.state';
import { getProductCategoriesListFilter } from '../list.selectors';
import { ProductCategoriesListFilter } from '../listFilter.interface';
import { ProductCategoriesListLoadCollectionFailedAction } from './loadCollectionFailed.action';
import { ProductCategoriesListLoadCollectionSuccessfulAction } from './loadCollectionSuccessful.action';

const type = generateActionType(PRODUCT_CATEGORIES_STATE_FEATURE_NAME, 'List - Load collection');

export class ProductCategoriesListLoadCollectionAction implements BaseAction<ProductCategoriesState> {
  feature = PRODUCT_CATEGORIES_STATE_FEATURE_NAME;
  type = type;

  handler(state: ProductCategoriesState): ProductCategoriesState {
    const list = setStateProperties(state.list, {
      isLoading: true,
      loadError: null,
    });
    return setStateProperties(state, { list });
  }
}

@Injectable()
export class ProductCategoriesListLoadCollectionActionEffect {
  @Effect()
  watchProductCategories$ = this.actions$.pipe(
    ofType(type),
    combineLatestOp(
      this.store.pipe(select(getProductCategoriesListFilter)),
      this.store.pipe(select(getActiveOrganizationId)),
      (action, productCategoriesListFilter, organizationId) => ({
        productCategoriesListFilter,
        organizationId,
      }),
    ),
    filter((data: { organizationId: string }) => !!data.organizationId),
    switchMap((data: { productCategoriesListFilter: ProductCategoriesListFilter; organizationId: string }) =>
      this.db
        .collection<ProductCategory>(`${CollectionNames.productCategories}`, ref =>
          ref
            .where('organizationId', '==', data.organizationId)
            .where('isDeleted', '==', !data.productCategoriesListFilter.isDeleted)
            .orderBy('name', 'asc'),
        )
        .snapshotChanges()
        .pipe(map(unwrapCollectionSnapshotChanges)),
    ),
    map((items: ProductCategory[]) => new ProductCategoriesListLoadCollectionSuccessfulAction(items)),
    catchError(error => of(new ProductCategoriesListLoadCollectionFailedAction(error))),
    // TODO for Anton: Unsubscribe when user leaves settings/product-categories
  );

  constructor(private actions$: Actions, private store: Store<AppState>, private db: AngularFirestore) {}
}
