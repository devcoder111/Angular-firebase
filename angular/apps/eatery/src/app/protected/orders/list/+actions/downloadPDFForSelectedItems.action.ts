import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { ORDERS_STATE_FEATURE_NAME } from '../../orders-state.module';
import { OrdersState } from '../../orders.state';

const type = generateActionType(ORDERS_STATE_FEATURE_NAME, 'List - Download all selected pdf');

export class OrdersListDownloadPDFForSelectedItemsAction implements BaseAction<OrdersState> {
  feature = ORDERS_STATE_FEATURE_NAME;
  type = type;
  state: OrdersState;

  handler(state: OrdersState): OrdersState {
    const list = setStateProperties(state.list, {
      selectedIds: state.list.selectedIds,
    });
    this.state = state;
    return setStateProperties(state, { list });
  }
}

@Injectable()
export class OrdersListDownloadPDFForSelectedItemsActionEffect {
  @Effect({ dispatch: false })
  download$ = this.actions$.pipe(
    ofType(type),
    tap((action: OrdersListDownloadPDFForSelectedItemsAction) => {
      action.state.list.selectedIds.forEach(selected => {
        const order = action.state.list.map[selected];
        if (order && order.publicPage.pdf && order.publicPage.pdf.url) {
          const child = document.createElement('a');
          child.setAttribute('href', order.publicPage.pdf.url);
          child.setAttribute('download', order.number + '.pdf');
          child.innerText = 'Download order';
          document.body.appendChild(child);
          child.click();
          child.remove();
        }
      });
    }),
  );

  constructor(private actions$: Actions) {}
}
