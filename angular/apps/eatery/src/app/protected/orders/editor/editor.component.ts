import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogService } from '@libs/confirm-dialog/src/confirm-dialog.service';
import { select, Store } from '@ngrx/store';
import { Order } from '@shared/types/order.interface';
import { OrderProduct } from '@shared/types/orderProduct.interface';
import { OrganizationSupplier } from '@shared/types/organizationSupplier.interface';
import { OrderStatuses } from '@shared/values/orderStatuses.array';
import { tap, withLatestFrom } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { OrdersMarkAsDraftAction } from '../+actions/markAsDraft.action';
import { OrdersRemoveAction } from '../+actions/remove.action';
import { OrdersVoidAction } from '../+actions/void.action';
import { AppState } from '../../../+core/store/app.state';
import { getLocationsActive } from '../../../+core/store/selectors';
import { OrdersEditorCreateAction } from './+actions/create.action';
import { OrdersEditorLoadAction } from './+actions/load.action';
import { OrdersEditorLoadRecentAction } from './+actions/loadRecent.action';
import { OrdersEditorProductsUpdateAction } from './+actions/productsUpdate.action';
import { OrdersEditorSaveAction } from './+actions/save.action';
import { OrdersEditorUpdateAction } from './+actions/update.action';
import { OrdersEditorSupplierUpdateAction } from './+actions/updateSupplier.action';
import {
  getOrdersEditorCanBeDeleted,
  getOrdersEditorCanBeSaved,
  getOrdersEditorCanBeUndeleted,
  getOrdersEditorCanBeVoided,
  getOrdersEditorCanModify,
  getOrdersEditorIsLoadingOrder,
  getOrdersEditorIsLoadingProducts,
  getOrdersEditorIsNew,
  getOrdersEditorIsReadOnly,
  getOrdersEditorIsSaveEnabled,
  getOrdersEditorIsSaving,
  getOrdersEditorIsSendEnabled,
  getOrdersEditorLoadOrderError,
  getOrdersEditorLoadProductsError,
  getOrdersEditorOrder,
  getOrdersEditorProducts,
  getOrdersEditorSaveError,
  getOrdersEditorSupplier,
} from './editor.selectors';

@Component({
  selector: 'fr-orders-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersEditorComponent implements OnInit, OnDestroy {
  form: FormGroup;
  sub = new Subscription();
  isNew$ = this.store.pipe(select(getOrdersEditorIsNew));
  isLoadingOrder$ = this.store.pipe(select(getOrdersEditorIsLoadingOrder));
  isLoadingProducts$ = this.store.pipe(select(getOrdersEditorIsLoadingProducts));
  loadOrderError$ = this.store.pipe(select(getOrdersEditorLoadOrderError));
  loadProductsError$ = this.store.pipe(select(getOrdersEditorLoadProductsError));
  saveError$ = this.store.pipe(select(getOrdersEditorSaveError));
  order$ = this.store.pipe(select(getOrdersEditorOrder));
  products$ = this.store.pipe(select(getOrdersEditorProducts));
  location$ = this.store.pipe(select(getLocationsActive));
  supplier$ = this.store.pipe(select(getOrdersEditorSupplier));
  isSaving$ = this.store.pipe(select(getOrdersEditorIsSaving));
  isSendEnabled$ = this.store.pipe(select(getOrdersEditorIsSendEnabled));
  canBeModified$ = this.store.pipe(select(getOrdersEditorCanModify));
  isSaveEnabled$ = this.store.pipe(select(getOrdersEditorIsSaveEnabled));
  canBeDeleted$ = this.store.pipe(select(getOrdersEditorCanBeDeleted));
  canBeVoided$ = this.store.pipe(select(getOrdersEditorCanBeVoided));
  canBeUndeleted$ = this.store.pipe(select(getOrdersEditorCanBeUndeleted));
  canBeSaved$ = this.store.pipe(select(getOrdersEditorCanBeSaved));
  isReadOnly$ = this.store.pipe(select(getOrdersEditorIsReadOnly));

  constructor(
    private location: Location,
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    public confirmDialogService: ConfirmDialogService,
  ) {}

  ngOnInit() {
    this.initOrder();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  initOrder() {
    // let copyFromId = this._routeParams.get('copyFrom');
    this.sub.add(
      this.activatedRoute.params
        .pipe(
          withLatestFrom(this.activatedRoute.queryParams, (params, queryParams) => ({
            id: params['id'],
            copyFromId: queryParams['copyFrom'],
          })),
          tap((data: { id?: string; copyFromId?: string }) => {
            const { id, copyFromId } = data;
            if (id) {
              this.store.dispatch(new OrdersEditorLoadAction(id));
            } else {
              if (copyFromId) {
                this.store.dispatch(new OrdersEditorLoadRecentAction(copyFromId));
              } else {
                this.store.dispatch(new OrdersEditorCreateAction());
              }
            }
          }),
        )
        .subscribe(),
    );
  }

  cancel(): void {
    this.location.back();
  }

  remove(order: Order): void {
    this.store.dispatch(new OrdersRemoveAction(order));
    // noinspection JSIgnoredPromiseFromCall
    this.router.navigate(['/orders']);
  }

  saveAsDraft(): void {
    this.store.dispatch(new OrdersEditorSaveAction(false));
  }

  send(andNew: boolean): void {
    this.store.dispatch(new OrdersEditorUpdateAction({ status: OrderStatuses.notSent.slug }));
    this.store.dispatch(new OrdersEditorSaveAction(andNew));
  }

  setProducts(products: OrderProduct[]): void {
    this.store.dispatch(new OrdersEditorProductsUpdateAction(products));
  }

  markAsDraft(order: Order): void {
    this.store.dispatch(new OrdersMarkAsDraftAction(order));
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

  patchOrder(orderData: Partial<Order>): void {
    this.store.dispatch(new OrdersEditorUpdateAction(orderData));
  }

  patchSupplier(supplier: OrganizationSupplier): void {
    this.store.dispatch(new OrdersEditorSupplierUpdateAction(supplier));
  }
}
