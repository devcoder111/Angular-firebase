import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { InvoiceProduct } from '@shared/types/invoiceProduct.interface';
import { OrganizationProduct } from '@shared/types/organizationProduct.interface';
import { AngularFirestore } from 'angularfire2/firestore';
import { map, withLatestFrom } from 'rxjs/operators';
import { AppState } from '../../../../+core/store/app.state';
import { getActiveLocationId, getActiveOrganizationId, getUser } from '../../../../+core/store/selectors';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { INVOICES_STATE_FEATURE_NAME } from '../../invoices-state.module';
import { InvoicesState } from '../../invoices.state';
import { getInvoicesEditorInvoice } from '../editor.selectors';
import { InvoicesEditorCreateProductSuccessfulAction } from './createProductSuccessful.action';

const type = generateActionType(INVOICES_STATE_FEATURE_NAME, 'Editor - Create product');

export class InvoicesEditorCreateProductAction implements BaseAction<InvoicesState> {
  feature = INVOICES_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: OrganizationProduct) {}

  handler(state: InvoicesState): InvoicesState {
    return state;
  }
}

@Injectable()
export class InvoicesEditorCreateProductActionEffect {
  @Effect()
  create$ = this.actions$.pipe(
    ofType(type),
    withLatestFrom(this.store, (action, state) => ({ action, state })),
    map((data: { action: InvoicesEditorCreateProductAction; state: AppState }) => {
      const state = data.state;
      const organizationProduct = data.action.payload;

      const product: InvoiceProduct = {
        id: this.db.createId(),
        invoiceId: getInvoicesEditorInvoice(state).id,
        organizationProductId: organizationProduct.id,
        name: organizationProduct.name,
        code: organizationProduct.code,
        nickname: organizationProduct.nickname,
        image: organizationProduct.image || null,
        unitTypeId: organizationProduct.invoiceUnitTypeId,
        unitTypeName: organizationProduct.invoiceUnitTypeName,
        price: organizationProduct.lastPriceFromHistory,
        quantity: 1,
        discount: 0,
        total: organizationProduct.lastPriceFromHistory,
        organizationId: getActiveOrganizationId(state),
        locationId: getActiveLocationId(state),
        createdAt: new Date(),
        createdBy: getUser(state).id,
        isDeleted: false,
      };
      return new InvoicesEditorCreateProductSuccessfulAction(product);
    }),
    // no catchError here, because "create" operation is local and sync, so "failed" case is not possible.
  );

  constructor(private actions$: Actions, private db: AngularFirestore, private store: Store<AppState>) {}
}
