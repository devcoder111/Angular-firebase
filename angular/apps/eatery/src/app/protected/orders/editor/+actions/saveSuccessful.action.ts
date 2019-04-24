import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { filter, map } from 'rxjs/operators';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { ORDERS_STATE_FEATURE_NAME } from '../../orders-state.module';
import { OrdersState } from '../../orders.state';
import { OrdersEditorCreateAction } from './create.action';

const type = generateActionType(ORDERS_STATE_FEATURE_NAME, 'Editor - Save successful');

export class OrdersEditorSaveSuccessfulAction implements BaseAction<OrdersState> {
  feature = ORDERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: boolean) {}

  handler(state: OrdersState): OrdersState {
    const editor = setStateProperties(state.editor, {
      isSaving: false,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class OrdersEditorSaveSuccessfulActionEffect {
  @Effect()
  saveSuccessful$ = this.actions$.pipe(
    ofType(type),
    map((action: OrdersEditorSaveSuccessfulAction) => {
      this.snackBar.open('Order was saved', null, { duration: 2500 });
      // noinspection JSIgnoredPromiseFromCall
      this.router.navigate(action.payload ? ['/orders/create'] : ['/orders']);
      return action.payload;
    }),
    filter(v => !!v),
    map(() => new OrdersEditorCreateAction()),
  );

  constructor(private actions$: Actions, private snackBar: MatSnackBar, private router: Router) {}
}
