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
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmDialogService } from '@libs/confirm-dialog/src/confirm-dialog.service';
import { EntitySelectorDialogService } from '@libs/entity-selector/src/entity-selector-dialog.service';
import { EntitySelectorConfig } from '@libs/entity-selector/src/entity-selector.module';
import { select, Store } from '@ngrx/store';
import { Invoice } from '@shared/types/invoice.interface';
import { InvoiceAdjustmentType } from '@shared/types/invoiceAdjustmentType.interface';
import { InvoiceProduct } from '@shared/types/invoiceProduct.interface';
import { OrganizationProduct } from '@shared/types/organizationProduct.interface';
import { OrganizationSupplier } from '@shared/types/organizationSupplier.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { Subscription } from 'rxjs/Subscription';
import { InvoicesEditorCreateAdjustmentAction } from '../+actions/createAdjustment.action';
import { InvoicesEditorCreateProductAction } from '../+actions/createProduct.action';
import { InvoicesEditorRemoveProductAction } from '../+actions/removeProduct.action';
import { AppState } from '../../../../+core/store/app.state';
import { isDeepEqual } from '../../../../+shared/helpers/compare.helper';
import { firestoreQueryStringStartsWith } from '../../../../+shared/helpers/firestore.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { trackByFn } from '../../../../../../../../shared/trackBy.helper';
import { getInvoicesEditorIsAddProductEnabled, isGSTRegistered } from '../editor.selectors';

@Component({
  selector: 'fr-invoices-editor-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicesEditorFormComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input()
  invoice: Invoice;
  @Input()
  canBeSaved: boolean;
  @Output()
  changed = new EventEmitter<Invoice>();
  @Input()
  products: any;
  @Input()
  isLoadingProducts: boolean;
  @Input()
  loadProductsError: boolean;
  @Output()
  productsChanged = new EventEmitter<Invoice>();
  @Output()
  add = new EventEmitter<void>();
  @Input()
  adjustments: any;
  @Input()
  isReadOnly: boolean;
  @Input()
  isLoadingAdjustments: boolean;
  @Input()
  loadAdjustmentsError: boolean;
  @Output()
  adjustmentsChanged = new EventEmitter<Invoice>();
  form: FormGroup;
  sub = new Subscription();
  isGSTRegistered$ = this.store.pipe(select(isGSTRegistered));
  isAddProductEnabled$ = this.store.pipe(select(getInvoicesEditorIsAddProductEnabled));
  trackByFn = trackByFn;
  selectSupplierConfig: EntitySelectorConfig<OrganizationSupplier>;

  constructor(
    private store: Store<AppState>,
    private entitySelectorDialog: EntitySelectorDialogService,
    public confirmDialogService: ConfirmDialogService,
  ) {}

  static invoiceViewToModel(formValue) {
    return setStateProperties(formValue, {});
  }

  static invoiceModelToView(product) {
    return setStateProperties(product, {});
  }

  ngAfterViewInit(): void {
    this.selectSupplierConfig = this.getSelectSupplierConfig();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['invoice']) {
      if (this.form) {
        this.setFormValue(this.invoice);
      } else {
        this.initForm(this.invoice);
      }
    }
    if (changes['canBeSaved'] && this.form) {
      if (this.canBeSaved) {
        this.form.enable();
      } else {
        this.form.disable();
      }
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  initForm(invoice: Invoice) {
    this.form = new FormGroup(
      {
        number: new FormControl(null, Validators.required),
        supplierId: new FormControl(null, Validators.required),
        invoiceDate: new FormControl(null, Validators.required),
      },
      { updateOn: 'blur' },
    );
    this.setFormValue(invoice);
    this.sub.add(
      this.form.valueChanges.subscribe(formValue => {
        const newInvoice = setStateProperties(this.invoice, {
          ...InvoicesEditorFormComponent.invoiceViewToModel(formValue),
        });

        if (!isDeepEqual(this.invoice, newInvoice)) {
          // Second check for infinite loop, since in Angular v5.2.7 form.patchValue(...,{emitEvent: false})
          // emits event no matter what
          // TODO: remove check once bug in Angular is fixed
          this.changed.emit(newInvoice);
        }
      }),
    );
  }

  setFormValue(invoice: Invoice): void {
    this.form.patchValue(InvoicesEditorFormComponent.invoiceModelToView(invoice), { emitEvent: false }); // Set value, but prevent infinite emit loop
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
          query = query.orderBy(displayField).where('organizationId', '==', this.invoice.organizationId);
          // .where(`byLocation.${this.invoice.locationId}`, '==', true) // requires Firestore index for each "byLocation.X" for some reason. TODO
          return query;
        },
      ],
      // Nasty workaround for now to filter byLocation
      // TODO: make this thing properly
      clientSideFilter: items => items.filter(item => item[`byLocation`][this.invoice.locationId] === true),
      displayField,
      checkFn: async supplier => {
        if (!supplier) {
          return;
        }
        if (this.invoice.supplierId && this.invoice.supplierId !== supplier.id && this.products.length) {
          const question = 'Current products will be deleted. Do you really want to change supplier?';
          if (await this.confirmDialogService.show(question)) {
            for (const product of this.products) {
              this.store.dispatch(new InvoicesEditorRemoveProductAction(product));
            }
          } else {
            return;
          }
        }
        const invoice = setStateProperties(this.invoice, {
          supplierId: supplier.id,
          supplierName: supplier.name,
          supplierIsGSTRegistered: supplier.isGSTRegistered,
        });
        if (!isDeepEqual(this.invoice, invoice)) {
          this.changed.emit(invoice);
        }
        return supplier;
      },
      getViewValue: (value, setViewValue) => setViewValue(this.invoice.supplierName),
    };
  }

  async createProduct() {
    const displayField = 'nickname';
    const product = await this.entitySelectorDialog.show<OrganizationProduct>({
      searchBoxPlaceholder: 'Search for products...',
      mode: 'single',
      collectionName: CollectionNames.products as string,
      queries: [
        (ref, searchText) => {
          let query = ref.limit(20);
          if (searchText) {
            query = firestoreQueryStringStartsWith(query, displayField, searchText);
          }
          query = query
            .orderBy(displayField)
            .where('organizationId', '==', this.invoice.organizationId)
            .where('supplierId', '==', this.invoice.supplierId);
          // .where(`byLocation.${invoice.locationId}`, '==', true) // requires Firestore index for each "byLocation.X" for some reason. TODO

          return query;
        },
      ],
      // Nasty workaround for now to filter byLocation
      // TODO: make this thing properly
      clientSideFilter: items => items.filter(item => item[`byLocation`][this.invoice.locationId] === true),
      displayField,
    });
    if (!product) {
      return;
    }
    this.store.dispatch(new InvoicesEditorCreateProductAction(product));
  }

  async createAdjustment() {
    const displayField = 'name';
    const adjustment = await this.entitySelectorDialog.show<InvoiceAdjustmentType>({
      searchBoxPlaceholder: 'Search for adjustment...',
      mode: 'single',
      collectionName: CollectionNames.invoiceAdjustmentTypes as string,
      queries: [
        (ref, searchText) => {
          let query = ref.limit(20);
          if (searchText) {
            query = firestoreQueryStringStartsWith(query, displayField, searchText);
          }
          return query;
        },
      ],
      displayField,
    });
    if (!adjustment) {
      return;
    }
    this.store.dispatch(new InvoicesEditorCreateAdjustmentAction(adjustment));
  }

  onProductsChanged(product: InvoiceProduct) {
    const newProducts = this.products.map(item => (item.id === product.id ? product : item));
    this.productsChanged.emit(newProducts);
  }

  onAdjustmentsChanged(adjustment: InvoiceProduct) {
    const newAdjustments = this.adjustments.map(item => (item.id === adjustment.id ? adjustment : item));
    this.adjustmentsChanged.emit(newAdjustments);
  }
}
