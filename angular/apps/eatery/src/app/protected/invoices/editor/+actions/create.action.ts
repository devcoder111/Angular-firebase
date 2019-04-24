import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Invoice } from '@shared/types/invoice.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { InvoiceStatuses } from '@shared/values/invoiceStatuses.array';
import { AngularFirestore } from 'angularfire2/firestore';
import { switchMap, withLatestFrom } from 'rxjs/operators';
import { AppState } from '../../../../+core/store/app.state';
import { getActiveLocationId, getActiveOrganizationId, getUser } from '../../../../+core/store/selectors';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { INVOICES_STATE_FEATURE_NAME } from '../../invoices-state.module';
import { InvoicesState } from '../../invoices.state';
import { InvoicesEditorLoadAction } from './load.action';
import { InvoicesEditorSaveFailedAction } from './saveFailed.action';

const type = generateActionType(INVOICES_STATE_FEATURE_NAME, 'Editor - Create');

export class InvoicesEditorCreateAction implements BaseAction<InvoicesState> {
  feature = INVOICES_STATE_FEATURE_NAME;
  type = type;

  handler(state: InvoicesState): InvoicesState {
    const editor = setStateProperties(state.editor, {
      isLoadingInvoice: true,
      invoice: null,
      products: null,
      adjustments: null,
      isSaving: true,
      saveError: null,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class InvoicesEditorCreateActionEffect {
  @Effect()
  create$ = this.actions$.pipe(
    ofType(type),
    withLatestFrom(this.store, (action, state) => state),
    switchMap((state: AppState) => {
      const item: Invoice = {
        id: this.db.createId(),
        number: null,
        organizationId: getActiveOrganizationId(state),
        locationId: getActiveLocationId(state),
        supplierId: null,
        supplierName: null,
        invoiceDate: null,
        subtotal: 0,
        taxes: 0,
        total: 0,
        status: InvoiceStatuses.draft.slug,
        isDeleted: false,
        createdAt: new Date(),
        createdBy: getUser(state).id,
      };
      const { id, ...invoice } = item;
      return this.db
        .doc(`${CollectionNames.invoices}/${id}`)
        .set(invoice)
        .then(() => new InvoicesEditorLoadAction(id))
        .catch(error => new InvoicesEditorSaveFailedAction(error));
    }),
  );

  constructor(private actions$: Actions, private db: AngularFirestore, private store: Store<AppState>) {}
}
