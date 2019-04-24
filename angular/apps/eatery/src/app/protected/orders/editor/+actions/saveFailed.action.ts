import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { LoggerService } from '../../../../+shared/services/logger.service';
import { ORDERS_STATE_FEATURE_NAME } from '../../orders-state.module';
import { OrdersState } from '../../orders.state';

const type = generateActionType(ORDERS_STATE_FEATURE_NAME, 'Editor - Save failed');

export class OrdersEditorSaveFailedAction implements BaseAction<OrdersState> {
  feature = ORDERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: Error) {}

  handler(state: OrdersState, action: this): OrdersState {
    const editor = setStateProperties(state.editor, {
      isSaving: false,
      saveError: action.payload,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class OrdersEditorSaveFailedActionEffect {
  @Effect({ dispatch: false })
  saveFailed$ = this.actions$.pipe(
    ofType(type),
    tap((action: OrdersEditorSaveFailedAction) => {
      this.logger.error('OrdersEditorSaveFailedActionEffect.saveFailed$', action.payload);
      this.snackBar.open(`Order save failed`, null, { duration: 2500 });
    }),
  );

  constructor(private actions$: Actions, private snackBar: MatSnackBar, private logger: LoggerService) {}
}
