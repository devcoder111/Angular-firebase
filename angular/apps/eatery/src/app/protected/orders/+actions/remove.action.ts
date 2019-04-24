import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Order } from '@shared/types/order.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { timer } from 'rxjs/observable/timer';
import { tap } from 'rxjs/operators';
import { ProtectedState } from '../../+store/state';
import { BaseAction, generateActionType } from '../../../+shared/helpers/state.helper';
import { LoggerService } from '../../../+shared/services/logger.service';
import { ORDERS_STATE_FEATURE_NAME } from '../orders-state.module';

const type = generateActionType(ORDERS_STATE_FEATURE_NAME, 'Remove');

export class OrdersRemoveAction implements BaseAction<ProtectedState> {
  feature = ORDERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: Order) {}

  handler(state: ProtectedState): ProtectedState {
    return state;
  }
}

@Injectable()
export class OrdersRemoveActionEffect {
  @Effect({ dispatch: false })
  delete$ = this.actions$.pipe(
    ofType(type),
    tap((action: OrdersRemoveAction) => {
      const order = action.payload;
      const snackBarRef = this.snackBar.open(
        `Order "${order.number || order.id}" will be deleted in a moment`,
        'CANCEL',
        { duration: 3500 },
      );

      const deleteSub = timer(3500).subscribe(() =>
        this.db
          .doc<Order>(`${CollectionNames.orders}/${order.id}`)
          .update({ isDeleted: true })
          .catch(error => {
            this.logger.error('OrdersRemoveActionEffect.delete$', error);
            this.snackBar.open(`Order wasn't deleted on the server. Error`, null, { duration: 2500 });
          }),
      );

      const subAction = snackBarRef.onAction().subscribe(() => {
        deleteSub.unsubscribe();
      });
      setTimeout(() => {
        subAction.unsubscribe();
        deleteSub.unsubscribe();
      }, 3550); // this prevents next snackBar from not being opened
    }),
  );

  constructor(
    private actions$: Actions,
    private db: AngularFirestore,
    private snackBar: MatSnackBar,
    private logger: LoggerService,
  ) {}
}
