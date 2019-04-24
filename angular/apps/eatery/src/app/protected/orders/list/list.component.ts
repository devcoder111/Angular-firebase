import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfirmDialogService } from '@libs/confirm-dialog/src/confirm-dialog.service';
import { select, Store } from '@ngrx/store';
import { Order } from '@shared/types/order.interface';
import { OrdersMarkAsDraftAction } from '../+actions/markAsDraft.action';
import { OrdersRemoveAction } from '../+actions/remove.action';
import { OrdersVoidAction } from '../+actions/void.action';
import { AppState } from '../../../+core/store/app.state';
import { trackByFn } from '../../../../../../../shared/trackBy.helper';
import { getOrdersEditorCanModify } from '../editor/editor.selectors';
import { canOrderBeDeleted, canOrderBeUndeleted, canOrderBeVoided } from '../helpers/selectors.helpers';
import { OrdersListDownloadPDFForSelectedItemsAction } from './+actions/downloadPDFForSelectedItems.action';
import { OrdersListLoadCollectionAction } from './+actions/loadCollection.action';
import { OrdersListSetFilterAction } from './+actions/setFilter.action';
import { OrdersListToggleSelectionAction } from './+actions/toggleSelection.action';
import { OrdersListToggleSelectionForAllAction } from './+actions/toggleSelectionForAll.action';
import {
  getOrdersListArray,
  getOrdersListFilter,
  getOrdersListIsFilterUsed,
  getOrdersListIsLoading,
  getOrdersListLoadError,
  getOrdersSelectedListMap,
} from './list.selectors';
import { OrdersListFilter } from './listFilter.interface';

@Component({
  selector: 'fr-orders-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersListComponent implements OnInit {
  state$ = this.store;
  orders$ = this.store.pipe(select(getOrdersListArray));
  isLoading$ = this.store.pipe(select(getOrdersListIsLoading));
  loadError$ = this.store.pipe(select(getOrdersListLoadError));
  filter$ = this.store.pipe(select(getOrdersListFilter));
  isFilterUsed$ = this.store.pipe(select(getOrdersListIsFilterUsed));
  selectedList$ = this.store.pipe(select(getOrdersSelectedListMap));
  form: FormGroup;
  canBeDeleted = canOrderBeDeleted;
  canBeUndeleted = canOrderBeUndeleted;
  canBeVoided = canOrderBeVoided;
  canBeModified$ = this.store.pipe(select(getOrdersEditorCanModify));

  trackByFn = trackByFn;

  constructor(private store: Store<AppState>, public confirmDialogService: ConfirmDialogService) {}

  ngOnInit() {
    this.store.dispatch(new OrdersListLoadCollectionAction());
  }

  setFilter(filter: OrdersListFilter): void {
    this.store.dispatch(new OrdersListSetFilterAction(filter));
  }

  remove(order: Order): void {
    this.store.dispatch(new OrdersRemoveAction(order));
  }

  async voidOrder(order: Order): Promise<void> {
    const confirmData = await this.confirmDialogService.prompt({
      title: 'Do you really want to void the order?',
      isAnswerRequired: true,
      placeholder: 'Please enter the reason',
    });
    if (confirmData.result) {
      this.store.dispatch(new OrdersVoidAction(order, confirmData.text));
    }
  }

  markAsDraft(order: Order): void {
    this.store.dispatch(new OrdersMarkAsDraftAction(order));
  }

  toggleOrder(event, order: Order) {
    this.store.dispatch(new OrdersListToggleSelectionAction(order.id));
  }

  selectAll(): void {
    this.store.dispatch(new OrdersListToggleSelectionForAllAction());
  }

  exportPDF(): void {
    this.store.dispatch(new OrdersListDownloadPDFForSelectedItemsAction());
  }
}
