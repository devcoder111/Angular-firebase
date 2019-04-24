import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Order } from '@shared/types/order.interface';
import { OrderProduct } from '@shared/types/orderProduct.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
  unwrapCollectionSnapshotChanges,
  unwrapDocSnapshotChanges,
} from '../../../../+shared/helpers/firestore.helper';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { ORDERS_STATE_FEATURE_NAME } from '../../orders-state.module';
import { OrdersState } from '../../orders.state';
import { OrdersEditorLoadOrderFailedAction } from './loadFailed.action';
import { OrdersEditorLoadProductsFailedAction } from './loadProductsFailed.action';
import { OrdersEditorProductsLoadSuccessfulAction } from './loadProductsSuccessful.action';
import { OrdersEditorLoadSuccessfulAction } from './loadSuccessful.action';
import { OrdersEditorProductsUpdateAction } from './productsUpdate.action';
import { OrdersEditorUpdateAction } from './update.action';

const type = generateActionType(ORDERS_STATE_FEATURE_NAME, 'Editor - Load');

export class OrdersEditorLoadAction implements BaseAction<OrdersState> {
  feature = ORDERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: string) {}

  handler(state: OrdersState): OrdersState {
    const editor = setStateProperties(state.editor, {
      isLoadingOrder: true,
      isLoadingProducts: true,
      order: null,
      products: null,
      loadOrderError: null,
      loadProductsError: null,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class OrdersEditorLoadActionEffect {
  @Effect()
  watchItem$ = this.actions$.pipe(
    ofType(type),
    switchMap((action: OrdersEditorLoadAction) =>
      this.db
        .doc<Order>(`${CollectionNames.orders}/${action.payload}`)
        .snapshotChanges()
        .pipe(
          map(unwrapDocSnapshotChanges),
          map(
            (item: Order, indexOfEvent: number) =>
              indexOfEvent === 0 // if first time
                ? new OrdersEditorLoadSuccessfulAction(item)
                : new OrdersEditorUpdateAction(item),
          ),
          catchError(error => of(new OrdersEditorLoadOrderFailedAction(error))),
          // TODO for Anton: Unsubscribe when user leaves /orders/:id
        ),
    ),
  );

  @Effect()
  watchProducts$ = this.actions$.pipe(
    ofType(type),
    switchMap((action: OrdersEditorLoadAction) =>
      this.db
        .collection<OrderProduct>(`${CollectionNames.orderProducts}`, ref =>
          ref.where('orderId', '==', action.payload).where('isDeleted', '==', false),
        )
        .snapshotChanges()
        .pipe(
          map(unwrapCollectionSnapshotChanges),
          map(
            (products: OrderProduct[], indexOfEvent: number) =>
              indexOfEvent === 0 // if first time
                ? new OrdersEditorProductsLoadSuccessfulAction(products)
                : new OrdersEditorProductsUpdateAction(products),
          ),
          catchError(error => of(new OrdersEditorLoadProductsFailedAction(error))),
          // TODO for Anton: Unsubscribe when user leaves /orders/:id
        ),
    ),
  );

  constructor(private actions$: Actions, private db: AngularFirestore) {}
}
