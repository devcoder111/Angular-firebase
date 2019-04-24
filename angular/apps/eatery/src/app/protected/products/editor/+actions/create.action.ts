import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { OrganizationProduct } from '@shared/types/organizationProduct.interface';
import { AngularFirestore } from 'angularfire2/firestore';
import { map, withLatestFrom } from 'rxjs/operators';
import { AppState } from '../../../../+core/store/app.state';
import { getActiveOrganizationId, getUser } from '../../../../+core/store/selectors';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { PRODUCTS_STATE_FEATURE_NAME } from '../../products-state.module';
import { ProductsState } from '../../products.state';
import { ProductsEditorCreateSuccessfulAction } from './createSuccessful.action';

const type = generateActionType(PRODUCTS_STATE_FEATURE_NAME, 'Editor - Create');

export class ProductsEditorCreateAction implements BaseAction<ProductsState> {
  feature = PRODUCTS_STATE_FEATURE_NAME;
  type = type;

  handler(state: ProductsState): ProductsState {
    const editor = setStateProperties(state.editor, {
      isLoadingProduct: true,
      isNew: true,
      product: null,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class ProductsEditorCreateActionEffect {
  @Effect()
  create$ = this.actions$.pipe(
    ofType(type),
    withLatestFrom(this.store, (action, state) => state),
    map((state: AppState) => {
      const item: OrganizationProduct = {
        // BaseProduct Fields
        id: this.db.createId(),
        name: null,
        code: null,
        supplierId: null,
        supplierName: null,
        createdAt: new Date(),
        createdBy: getUser(state).id,
        baseProductId: null,
        nickname: null,
        organizationId: getActiveOrganizationId(state),
        byLocation: {},
        lastPriceFromHistory: 0,
        productCategoryId: null,
        priceChangeNotificationPercentage: 0,
        invoiceUnitTypeId: null,
        invoiceUnitTypeName: null,
        orderUnitTypeId: null,
        orderUnitTypeName: null,
        orderUnitTypeRatio: 0,
      };
      return new ProductsEditorCreateSuccessfulAction(item);
    }),
    // no catchError here, because "create" operation is local and sync, so "failed" case is not possible.
  );

  constructor(private actions$: Actions, private db: AngularFirestore, private store: Store<AppState>) {}
}
