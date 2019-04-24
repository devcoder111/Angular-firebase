import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { InvoiceAdjustment } from '@shared/types/invoiceAdjustment.interface';
import { InvoiceAdjustmentType } from '@shared/types/invoiceAdjustmentType.interface';
import { AngularFirestore } from 'angularfire2/firestore';
import { map, withLatestFrom } from 'rxjs/operators';
import { AppState } from '../../../../+core/store/app.state';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { INVOICES_STATE_FEATURE_NAME } from '../../invoices-state.module';
import { InvoicesState } from '../../invoices.state';
import { getInvoicesEditorInvoice, getInvoicesEditorState } from '../editor.selectors';
import { InvoicesEditorCreateAdjustmentSuccessfulAction } from './createAdjustmentSuccessful.action';

const type = generateActionType(INVOICES_STATE_FEATURE_NAME, 'Editor - Create adjustment');

export class InvoicesEditorCreateAdjustmentAction implements BaseAction<InvoicesState> {
  feature = INVOICES_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: InvoiceAdjustmentType) {}

  handler(state: InvoicesState): InvoicesState {
    return state;
  }
}

@Injectable()
export class InvoicesEditorCreateAdjustmentActionEffect {
  @Effect()
  create$ = this.actions$.pipe(
    ofType(type),
    withLatestFrom(this.store, (action, state) => ({ action, state })),
    map((data: { action: InvoicesEditorCreateAdjustmentAction; state: AppState }) => {
      const state = data.state;
      const invoiceAdjustmentType = data.action.payload;
      const adjustmentsLength = (getInvoicesEditorState(state).adjustments || []).length;

      const adjustment: InvoiceAdjustment = {
        id: this.db.createId(),
        invoiceId: getInvoicesEditorInvoice(state).id,
        invoiceAdjustmentTypeId: invoiceAdjustmentType.id,
        value: 0,
        name: invoiceAdjustmentType.name,
        code: invoiceAdjustmentType.code,
        isPositive: invoiceAdjustmentType.isPositive,
        isDeleted: false,
        sortingNumber: adjustmentsLength,
      };
      return new InvoicesEditorCreateAdjustmentSuccessfulAction(adjustment);
    }),
    // no catchError here, because "create" operation is local and sync, so "failed" case is not possible.
  );

  constructor(private actions$: Actions, private db: AngularFirestore, private store: Store<AppState>) {}
}
