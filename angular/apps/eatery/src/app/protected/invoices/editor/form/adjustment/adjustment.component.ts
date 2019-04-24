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
import { InvoiceAdjustment } from '@shared/types/invoiceAdjustment.interface';
import { Subscription } from 'rxjs/Subscription';
import { InvoicesEditorRemoveAdjustmentAction } from '../../+actions/removeAdjustment.action';
import { AppState } from '../../../../../+core/store/app.state';
import { isDeepEqual } from '../../../../../+shared/helpers/compare.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';

@Component({
  selector: '[frInvoicesEditorAdjustmentsAdjustment]', // tslint:disable-line:component-selector
  templateUrl: './adjustment.component.html',
  styleUrls: ['./adjustment.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicesEditorAdjustmentsAdjustmentComponent implements OnChanges, OnDestroy {
  @Input()
  adjustment: InvoiceAdjustment;
  @Input()
  canBeSaved: boolean;
  @Input()
  isReadOnly: boolean;
  @Output()
  adjustmentsChanged = new EventEmitter<InvoiceAdjustment>();
  adjustmentForm: FormGroup;
  sub = new Subscription();
  minPrice = 0.0001;

  constructor(private store: Store<AppState>) {}

  static adjustmentViewToModel(formValue) {
    return setStateProperties(formValue, {
      value: convertMoneyViewToModel(formValue.value),
    });
  }

  static adjustmentModelToView(adjustment) {
    return setStateProperties(adjustment, {
      value: convertMoneyModelToView(adjustment.value),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['adjustment']) {
      if (this.adjustmentForm) {
        this.setFormValue(this.adjustment);
      } else {
        this.initForm(this.adjustment);
      }
    }
    if (changes['canBeSaved'] && this.adjustmentForm) {
      if (this.canBeSaved) {
        this.adjustmentForm.enable();
      } else {
        this.adjustmentForm.disable();
      }
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  initForm(adjustment: InvoiceAdjustment) {
    this.adjustmentForm = new FormGroup(
      {
        value: new FormControl(null, [Validators.required, Validators.min(this.minPrice)]),
      },
      { updateOn: 'blur' },
    );
    this.setFormValue(adjustment);
    this.sub.add(
      this.adjustmentForm.valueChanges.subscribe(formValue => {
        const newAdjustment = setStateProperties(this.adjustment, {
          ...InvoicesEditorAdjustmentsAdjustmentComponent.adjustmentViewToModel(formValue),
        });

        if (!isDeepEqual(this.adjustment, newAdjustment)) {
          // Second check for infinite loop, since in Angular v5.2.7 adjustmentForm.patchValue(...,{emitEvent: false})
          // emits event no matter what
          // TODO: remove check once bug in Angular is fixed
          this.adjustmentsChanged.emit(newAdjustment);
        }
      }),
    );
  }

  setFormValue(adjustment: InvoiceAdjustment): void {
    this.adjustmentForm.patchValue(InvoicesEditorAdjustmentsAdjustmentComponent.adjustmentModelToView(adjustment), {
      emitEvent: false,
    }); // Set value, but prevent infinite emit loop
  }

  remove(invoiceAdjustment) {
    this.store.dispatch(new InvoicesEditorRemoveAdjustmentAction(invoiceAdjustment));
  }
}
