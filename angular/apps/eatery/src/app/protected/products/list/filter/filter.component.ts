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
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { AppState } from '../../../../+core/store/app.state';
import { isDeepEqual } from '../../../../+shared/helpers/compare.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { getProductsEditorCanBeModified } from '../../editor/editor.selectors';
import { ProductsListFilter } from '../listFilter.interface';

@Component({
  selector: 'fr-products-list-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsListFilterComponent implements OnChanges, OnDestroy {
  @Input()
  filter: ProductsListFilter;
  @Output()
  changed = new EventEmitter<ProductsListFilter>();
  form: FormGroup;
  sub = new Subscription();
  canBeModified$ = this.store.pipe(select(getProductsEditorCanBeModified));

  constructor(private store: Store<AppState>) {}

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

  initForm(filter: ProductsListFilter) {
    this.form = new FormGroup({
      name: new FormControl(null),
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

  setFormValue(filter: ProductsListFilter): void {
    this.form.patchValue(filter, { emitEvent: false }); // Set value, but prevent infinite emit loop
  }
}
