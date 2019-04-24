import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { InvoiceStatuses } from '@shared/values/invoiceStatuses.array';
import { AngularFirestore } from 'angularfire2/firestore';
import { switchMap, withLatestFrom } from 'rxjs/operators';
import { AppState } from '../../../../+core/store/app.state';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { INVOICES_STATE_FEATURE_NAME } from '../../invoices-state.module';
import { InvoicesState } from '../../invoices.state';
import { getInvoicesEditorState } from '../editor.selectors';
import { InvoicesEditorState } from '../editor.state';
import { InvoicesEditorSaveFailedAction } from './saveFailed.action';
import { InvoicesEditorSaveSuccessfulAction } from './saveSuccessful.action';

const type = generateActionType(INVOICES_STATE_FEATURE_NAME, 'Editor - Save');

export class InvoicesEditorSaveAction implements BaseAction<InvoicesState> {
  feature = INVOICES_STATE_FEATURE_NAME;
  type = type;

  /**
   * @param payload - should save as "draft"?
   */
  constructor(public payload?: boolean) {}

  handler(state: InvoicesState): InvoicesState {
    const editor = setStateProperties(state.editor, {
      isSaving: true,
      saveError: null,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class InvoicesEditorSaveActionEffect {
  @Effect()
  save$ = this.actions$.pipe(
    ofType(type),
    withLatestFrom(this.store, (action, state) => ({ action, editor: getInvoicesEditorState(state) })),
    switchMap((data: { action: InvoicesEditorSaveAction; editor: InvoicesEditorState }) => {
      const batch = this.db.firestore.batch();
      const { id, ...invoice } = data.editor.invoice;
      const path = `${CollectionNames.invoices}/${id}`;
      const newInvoice = setStateProperties(invoice, {
        status: data.action.payload ? InvoiceStatuses.draft.slug : InvoiceStatuses.done.slug,
      });
      batch.set(this.db.doc(path).ref, newInvoice as any);
      const products = data.editor.products;
      products.forEach(product => {
        const { id, ...productBody } = product; // tslint:disable-line:no-shadowed-variable
        batch.set(this.db.doc(`${CollectionNames.invoiceProducts}/${id}`).ref, productBody);
      });
      const adjustments = data.editor.adjustments;
      adjustments.forEach(adjustment => {
        const { id, ...adjustmentBody } = adjustment; // tslint:disable-line:no-shadowed-variable
        batch.set(this.db.doc(`${CollectionNames.invoiceAdjustments}/${id}`).ref, adjustmentBody);
      });
      const images = data.editor.images;
      images.forEach(image => {
        const { id, ...imageBody } = image; // tslint:disable-line:no-shadowed-variable
        batch.set(this.db.doc(`${CollectionNames.files}/${id}`).ref, imageBody);
      });
      return batch
        .commit()
        .then(() => new InvoicesEditorSaveSuccessfulAction())
        .catch(
          error =>
            new InvoicesEditorSaveFailedAction({
              error,
              details: { path, invoice, products, adjustments },
            }),
        );
    }),
  );

  constructor(private actions$: Actions, private db: AngularFirestore, private store: Store<AppState>) {}
}
