import {
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
import { Store } from '@ngrx/store';
import { convertMoneyModelToView, convertMoneyViewToModel } from '@shared/helpers/convertMoney/convertMoney.helper';
import { calcLineTotal } from '@shared/helpers/taxes/taxes.helper';
import { InvoiceProduct } from '@shared/types/invoiceProduct.interface';
import { Subscription } from 'rxjs/Subscription';
import { InvoicesEditorRemoveProductAction } from '../../+actions/removeProduct.action';
import { AppState } from '../../../../../+core/store/app.state';
import { isDeepEqual } from '../../../../../+shared/helpers/compare.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';

@Component({
  selector: '[frInvoicesEditorProductsProduct]', // tslint:disable-line:component-selector
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicesEditorProductsProductComponent implements OnChanges, OnDestroy {
  @Input()
  product: InvoiceProduct;
  @Input()
  canBeSaved: boolean;
  @Input()
  isReadOnly: boolean;
  @Output()
  productsChanged = new EventEmitter<InvoiceProduct>();
  productForm: FormGroup;
  sub = new Subscription();
  minPrice = 0;
  minQuantity = 0.0001;
  minDiscount = 0;

  constructor(private store: Store<AppState>) {}

  static invoiceProductViewToModel(formValue) {
    formValue.price = convertMoneyViewToModel(formValue.price);
    return calcLineTotal(formValue);
  }

  static invoiceProductModelToView(product) {
    return setStateProperties(product, {
      price: convertMoneyModelToView(product.price),
      total: convertMoneyModelToView(product.total),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product']) {
      if (this.productForm) {
        this.setFormValue(this.product);
      } else {
        this.initForm(this.product);
      }
    }
    if (changes['canBeSaved'] && this.productForm) {
      if (this.canBeSaved) {
        this.productForm.enable();
      } else {
        this.productForm.disable();
      }
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  initForm(product: InvoiceProduct) {
    this.productForm = new FormGroup(
      {
        price: new FormControl(null, [Validators.required, Validators.min(this.minPrice)]),
        quantity: new FormControl(null, [Validators.required, Validators.min(this.minQuantity)]),
        discount: new FormControl(null, [Validators.required, Validators.min(this.minDiscount)]),
      },
      { updateOn: 'blur' },
    );
    this.setFormValue(product);
    this.sub.add(
      this.productForm.valueChanges.subscribe(formValue => {
        if (this.productForm.invalid) {
          return;
        }
        const newProduct = setStateProperties(this.product, {
          ...InvoicesEditorProductsProductComponent.invoiceProductViewToModel(formValue),
        });

        if (!isDeepEqual(this.product, newProduct)) {
          // Second check for infinite loop, since in Angular v5.2.7 productForm.patchValue(...,{emitEvent: false})
          // emits event no matter what
          // TODO: remove check once bug in Angular is fixed
          this.productsChanged.emit(newProduct);
        }
      }),
    );
  }

  setFormValue(product: InvoiceProduct): void {
    this.productForm.patchValue(InvoicesEditorProductsProductComponent.invoiceProductModelToView(product), {
      emitEvent: false,
    }); // Set value, but prevent infinite emit loop
  }

  remove(invoiceProduct) {
    this.store.dispatch(new InvoicesEditorRemoveProductAction(invoiceProduct));
  }
}
