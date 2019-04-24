import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Order } from '@shared/types/order.interface';
import { map } from 'rxjs/operators';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { ORDERS_STATE_FEATURE_NAME } from '../../orders-state.module';
import { OrdersState } from '../../orders.state';
import { OrdersEditorRecentOrderProductsLoadAction } from './loadRecentOrderProducts.actions';

const type = generateActionType(ORDERS_STATE_FEATURE_NAME, 'Editor - Recent order load successful');

export class OrdersEditorLoadRecentSuccessfulAction implements BaseAction<OrdersState> {
  feature = ORDERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: Order) {}

  handler(state: OrdersState, action: this): OrdersState {
    const editor = setStateProperties(state.editor, {
      isLoadingOrder: false,
      order: action.payload,
      isSaving: false,
      supplier: null,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class OrdersEditorCreateSuccessfulActionEffect {
  @Effect()
  loadRecentProducts$ = this.actions$.pipe(
    ofType(type),
    map((action: OrdersEditorLoadRecentSuccessfulAction) => {
      return new OrdersEditorRecentOrderProductsLoadAction(action.payload.recentOrderId);
    }),
  );

  constructor(private actions$: Actions) {}
}
