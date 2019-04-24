import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { OrderProduct } from '@shared/types/orderProduct.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap } from 'rxjs/operators';
import { unwrapCollectionSnapshotChanges } from '../../../../+shared/helpers/firestore.helper';
import { generateActionType } from '../../../../+shared/helpers/state.helper';
import { ORDERS_STATE_FEATURE_NAME } from '../../orders-state.module';
import { OrdersEditorCreateProductsFromRecentOrderAction } from './createProductsFromRecentOrder.action';
import { OrdersEditorLoadProductsFailedAction } from './loadProductsFailed.action';

const type = generateActionType(ORDERS_STATE_FEATURE_NAME, 'Editor - Recent Order Products load');

export class OrdersEditorRecentOrderProductsLoadAction {
  feature = ORDERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: string) {}
}

@Injectable()
export class OrdersEditorRecentOrderProductsLoadActionEffect {
  @Effect()
  watchProducts$ = this.actions$.pipe(
    ofType(type),
    switchMap((action: OrdersEditorRecentOrderProductsLoadAction) =>
      this.db
        .collection(`${CollectionNames.orderProducts}`, ref =>
          ref.where('orderId', '==', action.payload).where('isDeleted', '==', false),
        )
        .snapshotChanges()
        .pipe(
          map(unwrapCollectionSnapshotChanges),
          map((products: OrderProduct[]) => new OrdersEditorCreateProductsFromRecentOrderAction(products)),
          catchError(error => of(new OrdersEditorLoadProductsFailedAction(error))),
        ),
    ),
  );

  constructor(private actions$: Actions, private db: AngularFirestore) {}
}
