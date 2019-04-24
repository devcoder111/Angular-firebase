import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { calcDocTotals, calcLineTotal } from '@shared/helpers/taxes/taxes.helper';
import { OrderProduct } from '@shared/types/orderProduct.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { switchMap, withLatestFrom } from 'rxjs/operators';
import { AppState } from '../../../../+core/store/app.state';
import { getActiveLocationId, getActiveOrganizationId, getUser } from '../../../../+core/store/selectors';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { ORDERS_STATE_FEATURE_NAME } from '../../orders-state.module';
import { OrdersState } from '../../orders.state';
import { getOrdersEditorOrder } from '../editor.selectors';
import { OrdersEditorCreateProductSuccessfulAction } from './createProductSuccessful.action';
import { OrdersEditorLoadRecentOrderFailedAction } from './loadRecentFailed.action';

const type = generateActionType(ORDERS_STATE_FEATURE_NAME, 'Editor - Create product from recent order');

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export class OrdersEditorCreateProductsFromRecentOrderAction implements BaseAction<OrdersState> {
  feature = ORDERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: OrderProduct[]) {}

  handler(state: OrdersState, action: this): OrdersState {
    const order = calcDocTotals(state.editor.order, action.payload);
    const editor = setStateProperties(state.editor, { order });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class OrdersEditorCreateProductsFromRecentOrderEffect {
  @Effect()
  copyProducts$ = this.actions$.pipe(
    ofType(type),
    withLatestFrom(this.store, (action, state) => ({ action, state })),
    switchMap(async (data: { action: OrdersEditorCreateProductsFromRecentOrderAction; state: AppState }) => {
      const state = data.state;
      const order = getOrdersEditorOrder(state);
      const organizationProducts = data.action.payload;
      const products = [];

      const batch = this.db.firestore.batch();

      await asyncForEach(organizationProducts, async organizationProduct => {
        try {
          const originalProductRef = await this.db
            .doc(`${CollectionNames.products}/${organizationProduct.organizationProductId}`)
            .ref.get();
          const originalProductRefData = await originalProductRef.data();
          const product: OrderProduct = calcLineTotal({
            id: this.db.createId(),
            orderId: order.id,
            organizationProductId: organizationProduct.organizationProductId,
            name: organizationProduct.name,
            code: organizationProduct.code,
            nickname: organizationProduct.nickname,
            image: organizationProduct.image || null,
            quantity: organizationProduct.quantity,
            subtotal: organizationProduct.subtotal || 0,
            total: organizationProduct.total,
            unitTypeId: organizationProduct.unitTypeId,
            unitTypeName: organizationProduct.unitTypeName,
            price: originalProductRefData.lastPriceFromHistory,
            organizationId: getActiveOrganizationId(state),
            locationId: getActiveLocationId(state),
            createdAt: new Date(),
            createdBy: getUser(state).id,
            isDeleted: false,
          });
          products.push(product);
          const { id, ...productBody } = calcLineTotal(product); // tslint:disable-line:no-shadowed-variable
          batch.set(this.db.doc(`${CollectionNames.orderProducts}/${id}`).ref, productBody);
        } catch (error) {
          console.error('OrdersCopyProductsFromOrderActionEffect - error', error);
        }
      });

      const { id, ...model } = calcDocTotals(order, products);
      batch.set(this.db.doc(`${CollectionNames.orders}/${id}`).ref, model);

      return batch
        .commit()
        .then(() => {
          return new OrdersEditorCreateProductSuccessfulAction(products);
        })
        .catch(error => {
          return new OrdersEditorLoadRecentOrderFailedAction(error);
        });
    }),
  );

  constructor(private actions$: Actions, private db: AngularFirestore, private store: Store<AppState>) {}
}
