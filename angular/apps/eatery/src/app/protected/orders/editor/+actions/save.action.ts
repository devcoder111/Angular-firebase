import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { switchMap, withLatestFrom } from 'rxjs/operators';
import { AppState } from '../../../../+core/store/app.state';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { ORDERS_STATE_FEATURE_NAME } from '../../orders-state.module';
import { OrdersState } from '../../orders.state';
import { getOrdersEditorState } from '../editor.selectors';
import { OrdersEditorState } from '../editor.state';
import { OrdersEditorSaveFailedAction } from './saveFailed.action';
import { OrdersEditorSaveSuccessfulAction } from './saveSuccessful.action';

const type = generateActionType(ORDERS_STATE_FEATURE_NAME, 'Editor - Save');

export class OrdersEditorSaveAction implements BaseAction<OrdersState> {
  feature = ORDERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: boolean) {}

  handler(state: OrdersState): OrdersState {
    const editor = setStateProperties(state.editor, {
      isSaving: true,
      saveError: null,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class OrdersEditorSaveActionEffect {
  @Effect()
  save$ = this.actions$.pipe(
    ofType(type),
    withLatestFrom(this.store, (action, state) => ({
      action,
      editor: getOrdersEditorState(state),
    })),
    switchMap((data: { action: OrdersEditorSaveAction; editor: OrdersEditorState }) => {
      const { action, editor } = data;
      const batch = this.db.firestore.batch();
      const { id, ...model } = editor.order;
      batch.set(this.db.doc(`${CollectionNames.orders}/${id}`).ref, model);
      editor.products.forEach(product => {
        const { id, ...productBody } = product; // tslint:disable-line:no-shadowed-variable
        batch.set(this.db.doc(`${CollectionNames.orderProducts}/${id}`).ref, productBody);
      });
      return batch
        .commit()
        .then(() => new OrdersEditorSaveSuccessfulAction(action.payload))
        .catch(error => new OrdersEditorSaveFailedAction(error));
    }),
  );

  constructor(private actions$: Actions, private db: AngularFirestore, private store: Store<AppState>) {}
}
