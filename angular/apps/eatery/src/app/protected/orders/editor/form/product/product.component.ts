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
import { OrderProduct } from '@shared/types/orderProduct.interface';
import { Subscription } from 'rxjs/Subscription';
import { OrdersEditorRemoveProductAction } from '../../+actions/removeProduct.action';
import { AppState } from '../../../../../+core/store/app.state';
import { isDeepEqual } from '../../../../../+shared/helpers/compare.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';

@Component({
  selector: '[frOrdersEditorProductsProduct]', // tslint:disable-line:component-selector
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersEditorProductsProductComponent implements OnChanges, OnDestroy {
  @Input()
  product: OrderProduct;
  @Input()
  isReadOnly: boolean;
  @Output()
  productsChanged = new EventEmitter<OrderProduct>();
  form: FormGroup;
  sub = new Subscription();

  constructor(private store: Store<AppState>) {}

  static orderProductViewToModel(formValue) {
    formValue.price = convertMoneyViewToModel(formValue.price);
    return calcLineTotal(formValue);
  }

  static orderProductModelToView(product) {
    return setStateProperties(product, {
      price: convertMoneyModelToView(product.price),
      total: convertMoneyModelToView(product.total),
    });
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

  initForm(product: OrderProduct) {
    this.form = new FormGroup(
      {
        price: new FormControl(null),
        quantity: new FormControl(null, [Validators.required, Validators.min(1)]),
      },
      { updateOn: 'blur' },
    );
    this.setFormValue(product);
    this.sub.add(
      this.form.valueChanges.subscribe(formValue => {
        const newProduct = setStateProperties(this.product, {
          ...OrdersEditorProductsProductComponent.orderProductViewToModel(formValue),
        });
        if (!isDeepEqual(this.product, newProduct)) {
          // Second check for infinite loop, since in Angular v5.2.7 form.patchValue(...,{emitEvent: false})
          // emits event no matter what
          // TODO: remove check once bug in Angular is fixed
          this.productsChanged.emit(newProduct);
        }
      }),
    );
  }

  setFormValue(product: OrderProduct): void {
    this.form.patchValue(OrdersEditorProductsProductComponent.orderProductModelToView(product), { emitEvent: false }); // Set value, but prevent infinite emit loop
  }

  setProductAmount(product: OrderProduct, amount): void {
    this.form.patchValue({ quantity: amount });
  }

  remove(orderProduct) {
    this.store.dispatch(new OrdersEditorRemoveProductAction(orderProduct));
  }
}
