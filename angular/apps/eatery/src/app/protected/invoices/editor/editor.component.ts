import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Invoice } from '@shared/types/invoice.interface';
import { InvoiceAdjustment } from '@shared/types/invoiceAdjustment.interface';
import { InvoiceProduct } from '@shared/types/invoiceProduct.interface';
import { map, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { InvoicesRemoveAction } from '../+actions/remove.action';
import { InvoicesRestoreAction } from '../+actions/restore.action';
import { AppState } from '../../../+core/store/app.state';
import { InvoicesEditorAdjustmentsUpdateAction } from './+actions/adjustmentsUpdate.action';
import { InvoicesEditorCreateAction } from './+actions/create.action';
import { InvoicesEditorLoadAction } from './+actions/load.action';
import { InvoicesEditorProductsUpdateAction } from './+actions/productsUpdate.action';
import { InvoicesEditorSaveAction } from './+actions/save.action';
import { InvoicesEditorUpdateAction } from './+actions/update.action';
import {
  getInvoicesEditorAdjustments,
  getInvoicesEditorCanBeDeleted,
  getInvoicesEditorCanBeSaved,
  getInvoicesEditorCanBeUndeleted,
  getInvoicesEditorCanModify,
  getInvoicesEditorInvoice,
  getInvoicesEditorIsLoadingAdjustments,
  getInvoicesEditorIsLoadingInvoice,
  getInvoicesEditorIsLoadingProducts,
  getInvoicesEditorIsNew,
  getInvoicesEditorIsSaveEnabled,
  getInvoicesEditorIsSaving,
  getInvoicesEditorLoadAdjustmentsError,
  getInvoicesEditorLoadInvoiceError,
  getInvoicesEditorLoadProductsError,
  getInvoicesEditorProducts,
  getInvoicesEditorSaveError,
} from './editor.selectors';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFirestore } from 'angularfire2/firestore';
import { trackByFn } from '../../../../../../../shared/trackBy.helper';

@Component({
  selector: 'fr-invoices-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicesEditorComponent implements OnInit, OnDestroy {
  form: FormGroup;
  sub = new Subscription();
  isNew$ = this.store.pipe(select(getInvoicesEditorIsNew));
  isLoadingInvoice$ = this.store.pipe(select(getInvoicesEditorIsLoadingInvoice));
  loadInvoiceError$ = this.store.pipe(select(getInvoicesEditorLoadInvoiceError));
  products$ = this.store.pipe(select(getInvoicesEditorProducts));
  isLoadingProducts$ = this.store.pipe(select(getInvoicesEditorIsLoadingProducts));
  loadProductsError$ = this.store.pipe(select(getInvoicesEditorLoadProductsError));
  adjustments$ = this.store.pipe(select(getInvoicesEditorAdjustments));
  isLoadingAdjustments$ = this.store.pipe(select(getInvoicesEditorIsLoadingAdjustments));
  loadAdjustmentsError$ = this.store.pipe(select(getInvoicesEditorLoadAdjustmentsError));
  saveError$ = this.store.pipe(select(getInvoicesEditorSaveError));
  invoice$ = this.store.pipe(select(getInvoicesEditorInvoice));
  isSaving$ = this.store.pipe(select(getInvoicesEditorIsSaving));
  isSaveEnabled$ = this.store.pipe(select(getInvoicesEditorIsSaveEnabled));
  canBeDeleted$ = this.store.pipe(select(getInvoicesEditorCanBeDeleted));
  canBeUndeleted$ = this.store.pipe(select(getInvoicesEditorCanBeUndeleted));
  canBeSaved$ = this.store.pipe(select(getInvoicesEditorCanBeSaved));
  canModify$ = this.store.pipe(select(getInvoicesEditorCanModify));

  trackByFn = trackByFn;

  constructor(
    private location: Location,
    private store: Store<AppState>,
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.initInvoice();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  initInvoice() {
    this.sub.add(
      this.activatedRoute.params
        .pipe(
          map(params => params['id']),
          tap((id?: string) => {
            if (id) {
              this.store.dispatch(new InvoicesEditorLoadAction(id));
            } else {
              this.store.dispatch(new InvoicesEditorCreateAction());
            }
          }),
        )
        .subscribe(),
    );
  }

  cancel(): void {
    this.location.back();
  }

  remove(invoice: Invoice): void {
    this.store.dispatch(new InvoicesRemoveAction(invoice));
    // noinspection JSIgnoredPromiseFromCall
    this.router.navigate(['/invoices']);
  }

  save(asDraft?: boolean): void {
    this.store.dispatch(new InvoicesEditorSaveAction(asDraft));
  }

  setProducts(products: InvoiceProduct[]): void {
    this.store.dispatch(new InvoicesEditorProductsUpdateAction(products));
  }

  setAdjustments(products: InvoiceAdjustment[]): void {
    this.store.dispatch(new InvoicesEditorAdjustmentsUpdateAction(products));
  }

  patchInvoice(invoiceData: Partial<Invoice>): void {
    this.store.dispatch(new InvoicesEditorUpdateAction(invoiceData));
  }

  restore(invoice: Invoice): void {
    this.store.dispatch(new InvoicesRestoreAction(invoice));
  }
}
