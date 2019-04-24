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
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { isDeepEqual } from '../../../../../+shared/helpers/compare.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { ProductCategoriesListFilter } from '../listFilter.interface';

@Component({
  selector: 'fr-product-categories-list-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCategoriesListFilterComponent implements OnChanges, OnDestroy {
  @Input()
  filter: ProductCategoriesListFilter;
  @Output()
  changed = new EventEmitter<ProductCategoriesListFilter>();
  form: FormGroup;
  sub = new Subscription();
  statuses = [
    {
      title: 'Active',
      value: true,
    },
    {
      title: 'Inactive',
      value: false,
    },
  ];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter']) {
      if (this.form) {
        this.setFormValue(this.filter);
      } else {
        this.initForm(this.filter);
      }
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  initForm(filter: ProductCategoriesListFilter) {
    this.form = new FormGroup({
      isDeleted: new FormControl(null),
    });
    this.setFormValue(filter);
    this.sub.add(
      this.form.valueChanges.subscribe(formValue => {
        if (!formValue.number) {
          // Prevents number to be "" (empty string) as we need it to be compared to null
          formValue.number = null;
        }
        const newFilter = setStateProperties(this.filter, {
          ...formValue,
        });
        if (!isDeepEqual(this.filter, newFilter)) {
          // Second check for infinite loop, since in Angular v5.2.7 form.patchValue(...,{emitEvent: false})
          // emits event no matter what
          // TODO: remove check once bug in Angular is fixed
          this.changed.emit(newFilter);
        }
      }),
    );
  }

  setFormValue(filter: ProductCategoriesListFilter): void {
    this.form.patchValue(filter, { emitEvent: false }); // Set value, but prevent infinite emit loop
  }
}
