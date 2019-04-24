import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { LoggerService } from '../../../../+shared/services/logger.service';
import { ORDERS_STATE_FEATURE_NAME } from '../../orders-state.module';
import { OrdersState } from '../../orders.state';

const type = generateActionType(ORDERS_STATE_FEATURE_NAME, 'Editor - Load Recent Order failed');

export class OrdersEditorLoadRecentOrderFailedAction implements BaseAction<OrdersState> {
  feature = ORDERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: Error) {}

  handler(state: OrdersState, action: this): OrdersState {
    const editor = setStateProperties(state.editor, {
      isLoadingOrder: false,
      loadOrderError: action.payload,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class OrdersEditorLoadRecentOrderFailedActionEffect {
  @Effect()
  logError$ = this.actions$.pipe(
    ofType(type),
    tap((action: OrdersEditorLoadRecentOrderFailedAction) => {
      this.logger.error('OrdersEditorLoadRecentOrderFailedActionEffect.logError$', action.payload);
      this.snackBar.open(`Order copy failed`, null, { duration: 2500 });
    }),
  );

  constructor(private actions$: Actions, private logger: LoggerService, private snackBar: MatSnackBar) {}
}
