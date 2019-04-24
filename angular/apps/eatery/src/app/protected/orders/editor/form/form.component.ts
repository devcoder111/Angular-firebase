import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CollectionReference, Query } from '@firebase/firestore-types';
import { ConfirmDialogService } from '@libs/confirm-dialog/src/confirm-dialog.service';
import { EntitySelectorDialogService } from '@libs/entity-selector/src/entity-selector-dialog.service';
import { EntitySelectorConfig } from '@libs/entity-selector/src/entity-selector.module';
import { select, Store } from '@ngrx/store';
import { Location } from '@shared/types/location.interface';
import { Order } from '@shared/types/order.interface';
import { OrderProduct } from '@shared/types/orderProduct.interface';
import { OrganizationProduct } from '@shared/types/organizationProduct.interface';
import { OrganizationSupplier } from '@shared/types/organizationSupplier.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { OrderStatuses, OrderStatusSlugType } from '@shared/values/orderStatuses.array';
import { Subscription } from 'rxjs/Subscription';
import { OrdersEditorCreateProductAction } from '../+actions/createProduct.action';
import { OrdersEditorRecentOrderProductsLoadAction } from '../+actions/loadRecentOrderProducts.actions';
import { OrdersEditorSupplierLoadAction } from '../+actions/loadSupplier.actions';
import { OrdersEditorRemoveProductAction } from '../+actions/removeProduct.action';
import { AppState } from '../../../../+core/store/app.state';
import { isDeepEqual } from '../../../../+shared/helpers/compare.helper';
import { firestoreQueryStringStartsWith } from '../../../../+shared/helpers/firestore.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { minDateValidator } from '../../../../+shared/validators/minDate.validator';
import { trackByFn } from '../../../../../../../../shared/trackBy.helper';
import { isGSTRegistered } from '../editor.selectors';

@Component({
  selector: 'fr-orders-editor-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersEditorFormComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('productsSelectorLineMultipleAmountTemplate')
  productsSelectorLineMultipleAmountTemplate: TemplateRef<any>;
  @ViewChild('recentOrderSelectorTemplate')
  recentOrderSelectorTemplate: TemplateRef<any>;
  @Input()
  order: Order;
  @Input()
  isReadOnly: boolean;
  @Input()
  products: any;
  @Input()
  supplier: OrganizationSupplier;
  @Input()
  location: Location;
  @Input()
  isLoadingProducts: boolean;
  @Input()
  loadProductsError: boolean;
  @Output()
  supplierChanged = new EventEmitter<OrganizationSupplier>();
  @Output()
  productsChanged = new EventEmitter<Order>();
  @Output()
  changed = new EventEmitter<Order>();
  @Output()
  add = new EventEmitter<void>();
  form: FormGroup;
  sub = new Subscription();
  isGSTRegistered$ = this.store.pipe(select(isGSTRegistered));
  minDate = new Date(new Date().setHours(0, 0, 0, 0));
  selectSupplierConfig: EntitySelectorConfig<OrganizationSupplier>;
  selectRecentOrderConfig: EntitySelectorConfig<Order>;

  trackByFn = trackByFn;
  isDeliveryInfoPopoverVisible = false;

  constructor(
    private store: Store<AppState>,
    private entitySelectorDialog: EntitySelectorDialogService,
    public confirmDialogService: ConfirmDialogService,
  ) {}

  ngAfterViewInit(): void {
    this.selectSupplierConfig = this.getSelectSupplierConfig();
    this.selectRecentOrderConfig = this.getSelectRecentOrderConfig();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['order']) {
      if (this.form) {
        this.setFormValue(this.order);
      } else {
        this.initForm(this.order);
      }
    }
    if (changes['isReadOnly'] && this.form) {
      if (this.isReadOnly) {
        this.form.disable();
      } else {
        this.form.enable();
      }
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  initForm(order: Order) {
    if (order.supplierId) {
      this.store.dispatch(new OrdersEditorSupplierLoadAction(order.supplierId));
    }
    this.form = new FormGroup(
      {
        supplierId: new FormControl(null, Validators.required),
        recentOrderId: new FormControl(null),
        otherInstructions: new FormControl(null),
        deliveryDate: new FormControl(null, [Validators.required, minDateValidator(this.minDate)]),
      },
      { updateOn: 'blur' },
    );
    this.setFormValue(order);
    this.sub.add(
      this.form.valueChanges.subscribe(formValue => {
        const newOrder = setStateProperties(this.order, {
          ...formValue,
        });
        if (!isDeepEqual(this.order, newOrder)) {
          // Second check for infinite loop, since in Angular v5.2.7 form.patchValue(...,{emitEvent: false})
          // emits event no matter what
          // TODO: remove check once bug in Angular is fixed
          this.changed.emit(newOrder);
        }
      }),
    );
  }

  setFormValue(order: Order): void {
    this.form.patchValue(order, { emitEvent: false }); // Set value, but prevent infinite emit loop
  }

  setDeliveryDateToTomorrow(): void {
    const tomorrow = new Date();
    tomorrow.setDate(new Date().getDate() + 1);
    this.form.patchValue({ deliveryDate: tomorrow });
  }

  onProductsChanged(product: OrderProduct) {
    const newProducts = this.products.map(l => (l.id === product.id ? product : l));
    this.productsChanged.emit(newProducts);
  }

  async selectProducts() {
    const searchByField = 'nickname';
    const productGroupsMap = await this.entitySelectorDialog.show({
      width: '800px',
      searchBoxPlaceholder: 'Search product by nickname',
      mode: 'multipleAmount',
      customTemplate: this.productsSelectorLineMultipleAmountTemplate,
      collectionName: CollectionNames.products as string,
      queries: [
        (ref, searchText) => {
          let query = ref.limit(20);
          if (searchText) {
            query = firestoreQueryStringStartsWith(query, searchByField, searchText);
          }
          return query
            .orderBy(searchByField)
            .where('organizationId', '==', this.order.organizationId)
            .where('supplierId', '==', this.order.supplierId);
          // .where(`byLocation.${this.order.locationId}`, '==', true) // requires Firestore index for each "byLocation.X" for some reason. TODO
        },
      ],
      clientSideFilter: items => items.filter(item => item['byLocation'][this.order.locationId]),
    });
    if (!productGroupsMap) {
      return;
    }
    const productGroupsArr: {
      amount: number;
      item: OrganizationProduct;
    }[] = Object.keys(productGroupsMap).map(id => productGroupsMap[id]);
    this.store.dispatch(new OrdersEditorCreateProductAction(productGroupsArr));
  }

  getSelectSupplierConfig(): EntitySelectorConfig<OrganizationSupplier> {
    const displayField = 'name';
    return {
      searchBoxPlaceholder: 'Search for supplier...',
      mode: 'single',
      collectionName: CollectionNames.suppliers as string,
      queries: [
        (ref, searchText) => {
          let query = ref.limit(20);
          if (searchText) {
            query = firestoreQueryStringStartsWith(query, displayField, searchText);
          }
          return query.orderBy(displayField).where('organizationId', '==', this.order.organizationId);
          // .where(`byLocation.${this.order.locationId}`, '==', true) // requires Firestore index for each "byLocation.X" for some reason. TODO
        },
      ],
      // Nasty workaround for now to filter byLocation
      // TODO: make this thing properly
      clientSideFilter: items => items.filter(item => item.byLocation[this.order.locationId]),
      displayField,
      checkFn: async supplier => {
        if (!supplier || this.order.supplierId === supplier.id) {
          return;
        }
        if (this.products.length) {
          const question = 'Current products will be deleted. Do you really want to change supplier?';
          if (await this.confirmDialogService.show(question)) {
            for (const product of this.products) {
              this.store.dispatch(new OrdersEditorRemoveProductAction(product));
            }
          } else {
            return;
          }
        }
        const order = setStateProperties(this.order, {
          supplierId: supplier.id,
          supplierName: supplier.name,
          supplierIsGSTRegistered: supplier.isGSTRegistered,
          recentOrderNumber: null,
          recentOrderId: null,
        });
        if (!isDeepEqual(this.order, order)) {
          this.changed.emit(order);
        }
        this.supplierChanged.emit(supplier);
        return supplier;
      },
      getViewValue: (value, setViewValue) => setViewValue(this.order.supplierName),
    };
  }

  getSelectRecentOrderConfig(): EntitySelectorConfig<Order> {
    const displayField = 'number';
    const limit = 20;
    const filter = (
      ref: CollectionReference,
      search: string,
      status: OrderStatusSlugType,
      supplierId: string | null,
    ): Query => {
      let q = ref.limit(limit).orderBy(displayField);
      if (search) {
        q = firestoreQueryStringStartsWith(q, displayField, search);
      }
      if (supplierId) {
        q = q.where('supplierId', '==', this.order.supplierId);
      }
      return q
        .where('organizationId', '==', this.order.organizationId)
        .where('locationId', '==', this.order.locationId)
        .where('status', '==', status)
        .where('isDeleted', '==', false)
        .orderBy('createdAt', 'desc');
    };
    return {
      searchBoxPlaceholder: 'Search for recent Order...',
      mode: 'single',
      collectionName: CollectionNames.orders as string,
      customTemplate: this.recentOrderSelectorTemplate,
      width: '400px',
      queries: [
        (ref: CollectionReference, search: string) =>
          filter(ref, search, OrderStatuses.notSent.slug, this.order.supplierId),
        (ref: CollectionReference, search: string) =>
          filter(ref, search, OrderStatuses.sent.slug, this.order.supplierId),
        (ref: CollectionReference, search: string) =>
          filter(ref, search, OrderStatuses.read.slug, this.order.supplierId),
      ],
      orderByFn: (a, b) => b.createdAt - a.createdAt,
      clientSideFilter: (orders: Order[]) => orders.filter(o => o.id !== this.order.id).slice(0, limit),
      displayField,
      checkFn: async recentOrder => {
        if (!recentOrder || this.order.recentOrderId === recentOrder.id) {
          return;
        }
        if (this.products.length) {
          const question = 'Do you really want to change recent order? Current products will be deleted.';
          if (await this.confirmDialogService.show(question)) {
            for (const product of this.products) {
              this.store.dispatch(new OrdersEditorRemoveProductAction(product));
            }
          } else {
            return;
          }
        }
        const order = setStateProperties(this.order, {
          supplierId: recentOrder.supplierId,
          supplierName: recentOrder.supplierName,
          supplierIsGSTRegistered: recentOrder.supplierIsGSTRegistered,
          recentOrderNumber: recentOrder.number,
          recentOrderId: recentOrder.id,
        });
        if (!isDeepEqual(this.order, order)) {
          this.changed.emit(order);
        }
        this.store.dispatch(new OrdersEditorRecentOrderProductsLoadAction(recentOrder.id));

        this.store.dispatch(new OrdersEditorSupplierLoadAction(recentOrder.supplierId));
        return recentOrder;
      },
      getViewValue: (value, setViewValue) => setViewValue(this.order.recentOrderNumber),
    };
  }

  priceByOrderUnit(product) {
    return Math.round(product.lastPriceFromHistory * product.orderUnitTypeRatio);
  }
}
