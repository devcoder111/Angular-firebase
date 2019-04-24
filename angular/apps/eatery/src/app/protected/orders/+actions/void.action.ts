import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Order } from '@shared/types/order.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { OrderStatuses } from '@shared/values/orderStatuses.array';
import { AngularFirestore } from 'angularfire2/firestore';
import { tap } from 'rxjs/operators';
import { ProtectedState } from '../../+store/state';
import { BaseAction, generateActionType } from '../../../+shared/helpers/state.helper';
import { LoggerService } from '../../../+shared/services/logger.service';
import { ORDERS_STATE_FEATURE_NAME } from '../orders-state.module';

const type = generateActionType(ORDERS_STATE_FEATURE_NAME, 'Void');

export class OrdersVoidAction implements BaseAction<ProtectedState> {
  feature = ORDERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: Order, public reason: string) {}

  handler(state: ProtectedState): ProtectedState {
    return state;
  }
}

@Injectable()
export class OrdersVoidActionEffect {
  @Effect({ dispatch: false })
  Void = this.actions$.pipe(
    ofType(type),
    tap(async (action: OrdersVoidAction) => {
      const order = action.payload;
      try {
        await this.db.doc<Order>(`${CollectionNames.orders}/${order.id}`).update({
          status: OrderStatuses.voided.slug,
          voidReason: action.reason,
        });
        this.snackBar.open(`Order "${order.number}" was voided.`, null, {
          duration: 2500,
        });
      } catch (error) {
        this.logger.error(`OrdersVoidActionEffect.void$ - Error cancelling order #"${order.number}"`, error);
        this.snackBar.open(`Order "${order.number}" void failed.`, null, {
          duration: 2500,
        });
      }
    }),
  );

  constructor(
    private actions$: Actions,
    private db: AngularFirestore,
    private snackBar: MatSnackBar,
    private logger: LoggerService,
  ) {}
}
