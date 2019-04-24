import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { File } from '@shared/types/file.interface';
import { Invoice } from '@shared/types/invoice.interface';
import { InvoiceAdjustment } from '@shared/types/invoiceAdjustment.interface';
import { InvoiceProduct } from '@shared/types/invoiceProduct.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
  unwrapCollectionSnapshotChanges,
  unwrapDocSnapshotChanges,
} from '../../../../+shared/helpers/firestore.helper';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { INVOICES_STATE_FEATURE_NAME } from '../../invoices-state.module';
import { InvoicesState } from '../../invoices.state';
import { InvoicesEditorAdjustmentsUpdateAction } from './adjustmentsUpdate.action';
import { InvoicesEditorLoadAdjustmentsFailedAction } from './loadAdjustmentsFailed.action';
import { InvoicesEditorAdjustmentsLoadSuccessfulAction } from './loadAdjustmentsSuccessful.action';
import { InvoicesEditorLoadInvoiceFailedAction } from './loadFailed.action';
import { InvoicesEditorLoadImagesFailedAction } from './loadImagesFailed.action';
import { InvoicesEditorImagesLoadSuccessfulAction } from './loadImagesSuccessful.action';
import { InvoicesEditorLoadProductsFailedAction } from './loadProductsFailed.action';
import { InvoicesEditorProductsLoadSuccessfulAction } from './loadProductsSuccessful.action';
import { InvoicesEditorLoadSuccessfulAction } from './loadSuccessful.action';
import { InvoicesEditorProductsUpdateAction } from './productsUpdate.action';
import { InvoicesEditorUpdateAction } from './update.action';

const type = generateActionType(INVOICES_STATE_FEATURE_NAME, 'Editor - Load');

export class InvoicesEditorLoadAction implements BaseAction<InvoicesState> {
  feature = INVOICES_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: string) {}

  handler(state: InvoicesState): InvoicesState {
    const editor = setStateProperties(state.editor, {
      invoice: null,
      isLoadingInvoice: true,
      loadInvoiceError: null,
      isSaving: false,
      products: null,
      isLoadingProducts: true,
      loadProductsError: null,
      adjustments: null,
      isLoadingAdjustments: true,
      loadAdjustmentsError: null,
      isLoadingImages: true,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class InvoicesEditorLoadActionEffect {
  @Effect()
  watchItem$ = this.actions$.pipe(
    ofType(type),
    switchMap((action: InvoicesEditorLoadAction) =>
      this.db
        .doc<Invoice>(`${CollectionNames.invoices}/${action.payload}`)
        .snapshotChanges()
        .pipe(
          map(unwrapDocSnapshotChanges),
          map(
            (item: Invoice, indexOfEvent: number) =>
              indexOfEvent === 0 // if first time
                ? new InvoicesEditorLoadSuccessfulAction(item)
                : new InvoicesEditorUpdateAction(item),
          ),
          catchError(error => of(new InvoicesEditorLoadInvoiceFailedAction(error))),
          // TODO for Anton: Unsubscribe when user leaves /invoices/:id
        ),
    ),
  );

  @Effect()
  watchProducts$ = this.actions$.pipe(
    ofType(type),
    switchMap((action: InvoicesEditorLoadAction) =>
      this.db
        .collection<InvoiceProduct>(`${CollectionNames.invoiceProducts}`, ref =>
          ref.where('invoiceId', '==', action.payload).where('isDeleted', '==', false),
        )
        .snapshotChanges()
        .pipe(
          map(unwrapCollectionSnapshotChanges),
          map(
            (products: InvoiceProduct[], indexOfEvent: number) =>
              indexOfEvent === 0 // if first time
                ? new InvoicesEditorProductsLoadSuccessfulAction(products)
                : new InvoicesEditorProductsUpdateAction(products),
          ),
          catchError(error => of(new InvoicesEditorLoadProductsFailedAction(error))),
          // TODO for Anton: Unsubscribe when user leaves /invoices/:id
        ),
    ),
  );

  @Effect()
  watchAdjustments$ = this.actions$.pipe(
    ofType(type),
    switchMap((action: InvoicesEditorLoadAction) =>
      this.db
        .collection<InvoiceAdjustment>(`${CollectionNames.invoiceAdjustments}`, ref =>
          ref.where('invoiceId', '==', action.payload).where('isDeleted', '==', false),
        )
        .snapshotChanges()
        .pipe(
          map(unwrapCollectionSnapshotChanges),
          map(
            (adjustments: InvoiceAdjustment[], indexOfEvent: number) =>
              indexOfEvent === 0 // if first time
                ? new InvoicesEditorAdjustmentsLoadSuccessfulAction(adjustments)
                : new InvoicesEditorAdjustmentsUpdateAction(adjustments),
          ),
          catchError(error => of(new InvoicesEditorLoadAdjustmentsFailedAction(error))),
          // TODO for Anton: Unsubscribe when user leaves /invoices/:id
        ),
    ),
  );

  @Effect()
  watchImages$ = this.actions$.pipe(
    ofType(type),
    switchMap((action: InvoicesEditorLoadAction) =>
      this.db
        .collection<File>(`${CollectionNames.files}`, ref =>
          ref
            .where('sourceId', '==', action.payload)
            .where('sourceType', '==', 'invoice')
            .orderBy('meta.sortingNumber', 'asc'),
        )
        .snapshotChanges()
        .pipe(
          map(unwrapCollectionSnapshotChanges),
          map((images: File[]) => new InvoicesEditorImagesLoadSuccessfulAction(images)),
          catchError(error => of(new InvoicesEditorLoadImagesFailedAction(error))),
          // TODO for Anton: Unsubscribe when user leaves /invoices/:id
        ),
    ),
  );

  constructor(private actions$: Actions, private db: AngularFirestore) {}
}
