import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Order } from '@shared/types/order.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { of } from 'rxjs/observable/of';
import { catchError, combineLatest as combineLatestOp, filter, map, switchMap } from 'rxjs/operators';
import { AppState } from '../../../../+core/store/app.state';
import { getUserConfig } from '../../../../+core/store/selectors';
import {
  firestoreQueryStringStartsWith,
  unwrapCollectionSnapshotChanges,
} from '../../../../+shared/helpers/firestore.helper';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { ORDERS_STATE_FEATURE_NAME } from '../../orders-state.module';
import { OrdersState } from '../../orders.state';
import { getOrdersListFilter } from '../list.selectors';
import { OrdersListFilter } from '../listFilter.interface';
import { OrdersListLoadCollectionFailedAction } from './loadCollectionFailed.action';
import { OrdersListLoadCollectionSuccessfulAction } from './loadCollectionSuccessful.action';
import { UserConfig } from '@shared/types/userConfig.interface';

const type = generateActionType(ORDERS_STATE_FEATURE_NAME, 'List - Load collection');

export class OrdersListLoadCollectionAction implements BaseAction<OrdersState> {
  feature = ORDERS_STATE_FEATURE_NAME;
  type = type;

  handler(state: OrdersState): OrdersState {
    const list = setStateProperties(state.list, {
      isLoading: true,
      loadError: null,
    });
    return setStateProperties(state, { list });
  }
}

@Injectable()
export class OrdersListLoadCollectionActionEffect {
  @Effect()
  watchOrders$ = this.actions$.pipe(
    ofType(type),
    combineLatestOp(
      // watch additional data changes
      this.store.pipe(select(getUserConfig)), // triggers if activeLocationId was changed
      this.store.pipe(select(getOrdersListFilter)), // triggers if ordersListFilter was changed
      (action, userConfig, ordersListFilter) => ({
        userConfig,
        ordersListFilter,
      }),
    ),
    filter(
      (data: { userConfig: UserConfig; ordersListFilter: OrdersListFilter }) =>
        !!data.userConfig && !!data.userConfig.activeOrganizationId,
    ),
    switchMap((data: { userConfig: UserConfig; ordersListFilter: OrdersListFilter }) =>
      this.db
        .collection<Order>(`${CollectionNames.orders}`, ref => {
          let query = ref.limit(20);
          query = query.where('organizationId', '==', data.userConfig.activeOrganizationId);
          if (data.userConfig.activeLocationId) {
            query = query.where('locationId', '==', data.userConfig.activeLocationId);
          } else if (data.ordersListFilter.locationId) {
            query = query.where('locationId', '==', data.ordersListFilter.locationId);
          }
          if (data.ordersListFilter.supplierId) {
            query = query.where('supplierId', '==', data.ordersListFilter.supplierId);
          }

          if (data.ordersListFilter.number) {
            const field = 'number';
            query = firestoreQueryStringStartsWith(query, field, data.ordersListFilter.number).orderBy(field);
            // query = query.where(field, '==', data.ordersListFilter.number);
          }
          if (data.ordersListFilter.status) {
            query = query.where('status', '==', data.ordersListFilter.status);
          }
          query = query.where('isDeleted', '==', !!data.ordersListFilter.isDeleted);
          query = query.orderBy('createdAt', 'desc');
          return query;
        })
        .snapshotChanges(),
    ),
    map(unwrapCollectionSnapshotChanges),
    map((items: Order[]) => new OrdersListLoadCollectionSuccessfulAction(items)),
    catchError(error => of(new OrdersListLoadCollectionFailedAction(error))),
    // TODO for Anton: Unsubscribe when user leaves /orders
  );

  constructor(private actions$: Actions, private store: Store<AppState>, private db: AngularFirestore) {}
}
