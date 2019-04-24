import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { OrderProduct } from '@shared/types/orderProduct.interface';
import { OrganizationProduct } from '@shared/types/organizationProduct.interface';
import { AngularFirestore } from 'angularfire2/firestore';
import { map, withLatestFrom } from 'rxjs/operators';
import { AppState } from '../../../../+core/store/app.state';
import { getActiveLocationId, getActiveOrganizationId, getUser } from '../../../../+core/store/selectors';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { ORDERS_STATE_FEATURE_NAME } from '../../orders-state.module';
import { OrdersState } from '../../orders.state';
import { getOrdersEditorOrder } from '../editor.selectors';
import { OrdersEditorCreateProductSuccessfulAction } from './createProductSuccessful.action';

const type = generateActionType(ORDERS_STATE_FEATURE_NAME, 'Editor - Create product');

export class OrdersEditorCreateProductAction implements BaseAction<OrdersState> {
  feature = ORDERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: { amount: number; item: OrganizationProduct }[]) {}

  handler(state: OrdersState, action: this): OrdersState {
    const total = action.payload.reduce((acc, cur) => acc + cur.item.lastPriceFromHistory, state.editor.order.total);
    const order = setStateProperties(state.editor.order, { total });
    const editor = setStateProperties(state.editor, { order });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class OrdersEditorCreateProductActionEffect {
  @Effect()
  create$ = this.actions$.pipe(
    ofType(type),
    withLatestFrom(this.store, (action, state) => ({ action, state })),
    map((data: { action: OrdersEditorCreateProductAction; state: AppState }) => {
      const state = data.state;
      const organizationProducts = data.action.payload;
      const products = [];

      organizationProducts.map(organizationProduct => {
        const product: OrderProduct = {
          id: this.db.createId(),
          orderId: getOrdersEditorOrder(state).id,
          organizationProductId: organizationProduct.item.id,
          name: organizationProduct.item.name,
          code: organizationProduct.item.code,
          nickname: organizationProduct.item.nickname,
          image: organizationProduct.item.image || null,
          quantity: organizationProduct.amount,
          subtotal: 0,
          total: organizationProduct.item.orderUnitTypeRatio
            ? organizationProduct.amount *
              organizationProduct.item.lastPriceFromHistory *
              organizationProduct.item.orderUnitTypeRatio
            : organizationProduct.amount * organizationProduct.item.lastPriceFromHistory,
          unitTypeId: organizationProduct.item.orderUnitTypeRatio
            ? organizationProduct.item.orderUnitTypeId
            : organizationProduct.item.invoiceUnitTypeId,
          unitTypeName: organizationProduct.item.orderUnitTypeRatio
            ? organizationProduct.item.orderUnitTypeName
            : organizationProduct.item.invoiceUnitTypeName,
          price: organizationProduct.item.orderUnitTypeRatio
            ? organizationProduct.item.lastPriceFromHistory * organizationProduct.item.orderUnitTypeRatio
            : organizationProduct.item.lastPriceFromHistory,
          organizationId: getActiveOrganizationId(state),
          locationId: getActiveLocationId(state),
          createdAt: new Date(),
          createdBy: getUser(state).id,
          isDeleted: false,
        };
        products.push(product);
      });

      return new OrdersEditorCreateProductSuccessfulAction(products);
    }),
    // no catchError here, because "create" operation is local and sync, so "failed" case is not possible.
  );

  constructor(private actions$: Actions, private db: AngularFirestore, private store: Store<AppState>) {}
}
