import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Order } from '@shared/types/order.interface';
import { OrderStatuses } from '@shared/values/orderStatuses.array';
import { AngularFirestore } from 'angularfire2/firestore';
import { map, withLatestFrom } from 'rxjs/operators';
import { AppState } from '../../../../+core/store/app.state';
import { getActiveLocationId, getActiveOrganizationId, getUser } from '../../../../+core/store/selectors';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { ORDERS_STATE_FEATURE_NAME } from '../../orders-state.module';
import { OrdersState } from '../../orders.state';
import { OrdersEditorCreateSuccessfulAction } from './createSuccessful.action';

const type = generateActionType(ORDERS_STATE_FEATURE_NAME, 'Editor - Create');

export class OrdersEditorCreateAction implements BaseAction<OrdersState> {
  feature = ORDERS_STATE_FEATURE_NAME;
  type = type;

  handler(state: OrdersState): OrdersState {
    const editor = setStateProperties(state.editor, {
      isLoadingOrder: true,
      isNew: true,
      order: null,
      products: null,
      isSaving: true,
      saveError: null,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class OrdersEditorCreateActionEffect {
  @Effect()
  create$ = this.actions$.pipe(
    ofType(type),
    withLatestFrom(this.store, (action, state) => ({ action, state })),
    map((data: { action: OrdersEditorCreateAction; state: AppState }) => {
      const { state } = data;
      const order: Order = {
        id: this.db.createId(),
        supplierId: null,
        supplierName: null,
        deliveryDate: new Date(),
        number: null,
        total: 0,
        subtotal: 0,
        taxes: 0,
        createdAt: new Date(),
        createdBy: getUser(state).id,
        organizationId: getActiveOrganizationId(state),
        locationId: getActiveLocationId(state),
        supplierIsGSTRegistered: false,
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
        recentOrderNumber: null,
        recentOrderId: null,
        voidReason: null,
      };
      return new OrdersEditorCreateSuccessfulAction(order);
    }),
    // no catchError here, because "create" operation is local and sync, so "failed" case is not possible.
  );

  constructor(private actions$: Actions, private db: AngularFirestore, private store: Store<AppState>) {}
}
