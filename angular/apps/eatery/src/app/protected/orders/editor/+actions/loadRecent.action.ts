import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Order } from '@shared/types/order.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { OrderStatuses } from '@shared/values/orderStatuses.array';
import { AngularFirestore } from 'angularfire2/firestore';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { AppState } from '../../../../+core/store/app.state';
import { getActiveLocationId, getActiveOrganizationId, getUser } from '../../../../+core/store/selectors';
import { unwrapDocSnapshotChanges } from '../../../../+shared/helpers/firestore.helper';
import { generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { ORDERS_STATE_FEATURE_NAME } from '../../orders-state.module';
import { OrdersState } from '../../orders.state';
import { OrdersEditorLoadRecentOrderFailedAction } from './loadRecentFailed.action';
import { OrdersEditorLoadRecentSuccessfulAction } from './loadRecentSuccessful.action';

const type = generateActionType(ORDERS_STATE_FEATURE_NAME, 'Editor - Recent Order load');

export class OrdersEditorLoadRecentAction {
  feature = ORDERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: string) {}

  handler(state: OrdersState): OrdersState {
    const editor = setStateProperties(state.editor, {
      isLoadingOrder: true,
      loadOrderError: null,
      isNew: true,
      order: null,
      products: null,
      isLoadingProducts: true,
      loadProductsError: null,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class OrdersEditorLoadRecentActionEffect {
  @Effect()
  loadRecent$ = this.actions$.pipe(
    ofType(type),
    withLatestFrom(this.store, (action, state) => ({ action, state })),
    switchMap((data: { action: OrdersEditorLoadRecentAction; state: AppState }) => {
      const { action, state } = data;
      return this.db
        .doc<Order>(`${CollectionNames.orders}/${action.payload}`)
        .snapshotChanges()
        .pipe(
          map(unwrapDocSnapshotChanges),
          map((recentOrder: Order) => {
            const order: Order = {
              id: this.db.createId(),
              supplierId: recentOrder.supplierId,
              supplierName: recentOrder.supplierName,
              deliveryDate: new Date(),
              number: null,
              total: 0,
              subtotal: 0,
              taxes: 0,
              createdAt: new Date(),
              createdBy: getUser(state).id,
              organizationId: getActiveOrganizationId(state),
              locationId: getActiveLocationId(state),
              supplierIsGSTRegistered: recentOrder.supplierIsGSTRegistered,
              isDeleted: false,
              otherInstructions: null,
              status: OrderStatuses.draft.slug,
              publicPage: {
                openedAt: null,
                html: {
                  url: null,
                  fileId: null,
                },
                pdf: {
                  url: null,
                  fileId: null,
                },
              },
              recentOrderNumber: recentOrder.number,
              recentOrderId: recentOrder.id,
              voidReason: null,
            };
            return new OrdersEditorLoadRecentSuccessfulAction(order);
          }),
          catchError(error => of(new OrdersEditorLoadRecentOrderFailedAction(error))),
          // TODO for Anton: Unsubscribe when user leaves /orders/create/copy-from/:id
        );
    }),
  );

  constructor(private actions$: Actions, private db: AngularFirestore, private store: Store<AppState>) {}
}
