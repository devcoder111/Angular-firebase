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

const type = generateActionType(ORDERS_STATE_FEATURE_NAME, 'Mark as Draft');

export class OrdersMarkAsDraftAction implements BaseAction<ProtectedState> {
  feature = ORDERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: Order) {}

  handler(state: ProtectedState): ProtectedState {
    return state;
  }
}

@Injectable()
export class OrdersMarkAsDraftActionEffect {
  @Effect({ dispatch: false })
  markAsDraft$ = this.actions$.pipe(
    ofType(type),
    tap(async (action: OrdersMarkAsDraftAction) => {
      const order = action.payload;
      try {
        await this.db.doc<Order>(`${CollectionNames.orders}/${order.id}`).update({
          isDeleted: false,
          status: OrderStatuses.draft.slug,
        });
        this.snackBar.open(`Order "${order.number}" was moved to draft.`, null, { duration: 2500 });
      } catch (error) {
        this.logger.error(
          `OrdersMarkAsDraftActionEffect.markAsDraft$ - Error moving order "${order.number}" to draft`,
          error,
        );
        this.snackBar.open(`Order "${order.number}" move to draft failed.`, null, { duration: 2500 });
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
