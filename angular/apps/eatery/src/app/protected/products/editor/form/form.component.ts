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
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { EntitySelectorDialogService } from '@libs/entity-selector/src/entity-selector-dialog.service';
import { EntitySelectorConfig } from '@libs/entity-selector/src/entity-selector.module';
import { select, Store } from '@ngrx/store';
import { convertMoneyModelToView, convertMoneyViewToModel } from '@shared/helpers/convertMoney/convertMoney.helper';
import { Location } from '@shared/types/location.interface';
import { OrganizationProduct } from '@shared/types/organizationProduct.interface';
import { OrganizationSupplier } from '@shared/types/organizationSupplier.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { getProductCategories, getUnitTypes } from '../../../+store/selectors';
import { AppState } from '../../../../+core/store/app.state';
import {
  getActiveLocationId,
  getActiveOrganizationId,
  isActivePositionOrganization,
} from '../../../../+core/store/selectors';
import { isDeepEqual } from '../../../../+shared/helpers/compare.helper';
import { firestoreQueryStringStartsWith } from '../../../../+shared/helpers/firestore.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { trackByFn } from '../../../../../../../../shared/trackBy.helper';
import { getCurrentUser } from '../../../../../../../../shared/getUser.helper';

@Component({
  selector: 'fr-products-editor-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsEditorFormComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input()
  state: AppState;
  @Input()
  product: OrganizationProduct;
  @Input()
  isNew: boolean;
  @Input()
  isReadOnly: boolean;
  @Output()
  changed = new EventEmitter<OrganizationProduct>();
  form: FormGroup;
  sub = new Subscription();
  productCategories$ = this.store.pipe(select(getProductCategories));
  unitTypes$ = this.store.pipe(select(getUnitTypes));
  priceChangeNotificationPercentageOptions = Array.from(new Array(10), (v, i) => (i + 1) * 10);
  minPrice = 0.0001;
  minUnitTypeRatio = 0.0001;
  trackByFn = trackByFn;
  selectSupplierConfig: EntitySelectorConfig<OrganizationSupplier>;

  constructor(private store: Store<AppState>, private entitySelectorDialog: EntitySelectorDialogService) {}

  static productModelToView(product) {
    const lastPriceFromHistory = convertMoneyModelToView(product.lastPriceFromHistory);
    return setStateProperties(product, { lastPriceFromHistory });
  }

  productViewToModel(formValue) {
    // TODO: make this thing properly
    let invoiceUnitTypeName = null;
    this.unitTypes$.pipe(first()).subscribe(unitTypes => {
      const unitType = unitTypes.find(item => item.id === formValue.invoiceUnitTypeId);
      invoiceUnitTypeName = unitType ? unitType.name : 'Unknown';
    });
    // TODO: make this thing properly
    let orderUnitTypeName = null;
    this.unitTypes$.pipe(first()).subscribe(unitTypes => {
      const unitType = unitTypes.find(item => item.id === formValue.orderUnitTypeId);
      orderUnitTypeName = unitType ? unitType.name : 'Unknown';
    });
    const lastPriceFromHistory = convertMoneyViewToModel(formValue.lastPriceFromHistory);
    return setStateProperties(formValue, {
      lastPriceFromHistory,
      invoiceUnitTypeName,
      orderUnitTypeName,
    });
  }

  ngAfterViewInit(): void {
    this.selectSupplierConfig = this.getSelectSupplierConfig();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product']) {
      if (this.form) {
        this.setFormValue(this.product);
      } else {
        this.initForm(this.product);
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

  initForm(product: OrganizationProduct) {
    this.form = new FormGroup(
      {
        name: new FormControl(null, Validators.required),
        code: new FormControl(null, Validators.required),
        nickname: new FormControl(null, Validators.required),
        supplierId: new FormControl({ value: null, disabled: !this.isNew }, Validators.required),
        lastPriceFromHistory: new FormControl(null, [Validators.required, Validators.min(this.minPrice)]),
        productCategoryId: new FormControl(null, Validators.required),
        priceChangeNotificationPercentage: new FormControl(null, Validators.required),
        invoiceUnitTypeId: new FormControl(null, Validators.required),
        orderUnitTypeId: new FormControl(null),
        orderUnitTypeRatio: new FormControl(null, this.unitTypeRatioValidator()),
      },
      { updateOn: 'blur' },
    );
    this.setFormValue(product);
    this.sub.add(
      this.form.valueChanges.subscribe(formValue => {
        const newProduct = setStateProperties(this.product, {
          ...this.productViewToModel(formValue),
        });
        if (!isDeepEqual(this.product, newProduct)) {
          // Second check for infinite loop, since in Angular v5.2.7 form.patchValue(...,{emitEvent: false})
          // emits event no matter what
          // TODO: remove check once bug in Angular is fixed
          this.changed.emit(newProduct);
        }
      }),
    );
  }

  setFormValue(product: OrganizationProduct): void {
    this.form.patchValue(ProductsEditorFormComponent.productModelToView(product), { emitEvent: false }); // Set value, but prevent infinite emit loop
  }

  resetOrderUnit() {
    this.setFormValue(
      setStateProperties(this.product, {
        orderUnitTypeId: null,
        orderUnitTypeRatio: null,
      }),
    );
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
          query = query.orderBy(displayField).where('organizationId', '==', getActiveOrganizationId(this.state));
          // .where(`byLocation.${getActiveLocationId(state)}`, '==', true) // requires Firestore index for each "byLocation.X" for some reason. TODO
          return query;
        },
      ],
      // Nasty workaround for now to filter byLocation
      // TODO: make this thing properly
      clientSideFilter: items =>
        items.filter(
          item =>
            item[`byLocation`][getActiveLocationId(this.state)] === true ||
            isActivePositionOrganization(this.state) === true,
        ),
      displayField,
      checkFn: supplier => {
        if (!supplier) {
          return;
        }
        const product = setStateProperties(this.product, {
          supplierId: supplier.id,
          supplierName: supplier.name,
          productCategoryId: this.product.productCategoryId,
        });
        if (!isDeepEqual(this.product, product)) {
          this.changed.emit(product);
        }
        return supplier;
      },
      getViewValue: (value, setViewValue) => setViewValue(this.product.supplierName),
    };
  }

  unitTypeRatioValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!this.form || !this.form.value.orderUnitTypeId) {
        return null;
      }
      const valid = control.value >= this.minUnitTypeRatio;
      return valid ? null : { unitTypeRatio: { value: control.value } };
    };
  }

  priceByOrderUnit() {
    return Math.round(this.product.lastPriceFromHistory * this.product.orderUnitTypeRatio);
  }

  async selectLocations(product: OrganizationProduct) {
    const productCopy = { ...product } as OrganizationProduct;
    const displayField = 'name';
    const userId = (await getCurrentUser(this.store)).id;
    const locations: Location[] = await this.entitySelectorDialog.show<Location>({
      title: 'Select locations to grant access right to the listed product',
      searchBoxPlaceholder: 'Search locations',
      submitButtonText: 'Save',
      mode: 'multiple',
      selectedItems: Object.keys(productCopy.byLocation).map(id => ({ id })),
      collectionName: CollectionNames.locations as string,
      queries: [
        (ref, searchText) => {
          let query = ref.limit(20);
          if (searchText) {
            query = firestoreQueryStringStartsWith(query, displayField, searchText);
          }
          query = query
            .orderBy(displayField)
            .where('isDeleted', '==', false)
            .where('availableForUsers', 'array-contains', userId)
            .where('organizationId', '==', productCopy.organizationId);
          return query;
        },
      ],
      displayField,
    });
    if (!locations) {
      return;
    }
    productCopy.byLocation = locations.reduce((acc, cur) => ({ ...acc, [cur.id]: true }), {});
    if (!isDeepEqual(this.product, productCopy)) {
      this.changed.emit(productCopy);
    }
  }
}
