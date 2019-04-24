import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Invoice } from '@shared/types/invoice.interface';
import { InvoicesRemoveAction } from '../+actions/remove.action';
import { InvoicesRestoreAction } from '../+actions/restore.action';
import { AppState } from '../../../+core/store/app.state';
import { NotImplementedService } from '../../../+shared/not-implemented/not-implemented.service';
import { trackByFn } from '../../../../../../../shared/trackBy.helper';
import { getOrdersEditorCanModify } from '../../orders/editor/editor.selectors';
import { canInvoiceBeDeleted, canInvoiceBeUndeleted } from '../helpers/selectors.helpers';
import { InvoicesListLoadCollectionAction } from './+actions/loadCollection.action';
import { InvoicesListLoadCountersAction } from './+actions/loadCounters.action';
import { InvoicesListSetFilterAction } from './+actions/setFilter.action';
import {
  getInvoicesListArray,
  getInvoicesListCounters,
  getInvoicesListFilter,
  getInvoicesListIsFilterUsed,
  getInvoicesListIsLoading,
  getInvoicesListLoadError,
} from './list.selectors';
import { InvoicesListFilter } from './listFilter.interface';

@Component({
  selector: 'fr-invoices-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicesListComponent implements OnInit {
  state$ = this.store;
  invoices$ = this.store.pipe(select(getInvoicesListArray));
  counters$ = this.store.pipe(select(getInvoicesListCounters));
  isLoading$ = this.store.pipe(select(getInvoicesListIsLoading));
  loadError$ = this.store.pipe(select(getInvoicesListLoadError));
  filter$ = this.store.pipe(select(getInvoicesListFilter));
  isFilterUsed$ = this.store.pipe(select(getInvoicesListIsFilterUsed));
  form: FormGroup;
  canBeDeleted = canInvoiceBeDeleted;
  canBeUndeleted = canInvoiceBeUndeleted;
  canBeModified$ = this.store.pipe(select(getOrdersEditorCanModify));

  trackByFn = trackByFn;

  constructor(private store: Store<AppState>, private notImplementedService: NotImplementedService) {}

  ngOnInit() {
    this.store.dispatch(new InvoicesListLoadCollectionAction());
    this.store.dispatch(new InvoicesListLoadCountersAction());
  }

  setFilter(filter: InvoicesListFilter): void {
    this.store.dispatch(new InvoicesListSetFilterAction(filter));
  }

  remove(invoice: Invoice): void {
    this.store.dispatch(new InvoicesRemoveAction(invoice));
  }

  restore(invoice: Invoice): void {
    this.store.dispatch(new InvoicesRestoreAction(invoice));
  }

  selectAll(): void {
    this.notImplementedService.showSnackbar();
  }

  exportPDF(): void {
    this.notImplementedService.showSnackbar();
  }
}
