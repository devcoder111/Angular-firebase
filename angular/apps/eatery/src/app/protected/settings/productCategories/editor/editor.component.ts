import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { ProductCategory } from '@shared/types/productCategory.interface';
import { Subscription } from 'rxjs/Subscription';
import { AppState } from '../../../../+core/store/app.state';
import { isDeepEqual } from '../../../../+shared/helpers/compare.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { ProductCategoriesEditorCreateAction } from './+actions/create.action';
import { ProductCategoriesEditorItemLoadAction } from './+actions/load.action';
import { ProductCategoriesEditorSaveAction } from './+actions/save.action';
import { ProductCategoriesEditorUpdateAction } from './+actions/update.action';
import {
  getProductCategoriesEditorCategory,
  getProductCategoriesEditorIsLoadingCategory,
  getProductCategoriesEditorIsReadOnly,
  getProductCategoriesEditorIsSaveEnabled,
  getProductCategoriesEditorIsSaving,
  getProductCategoriesEditorLoadCategoryError,
  getProductCategoriesEditorSaveError,
} from './editor.selectors';

@Component({
  selector: 'fr-product-categories-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCategoriesEditorComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  category: ProductCategory;
  @Output()
  resulted = new EventEmitter<any>();
  form: FormGroup;
  sub = new Subscription();
  isLoadingCategory$ = this.store.pipe(select(getProductCategoriesEditorIsLoadingCategory));
  loadCategoryError$ = this.store.pipe(select(getProductCategoriesEditorLoadCategoryError));
  saveError$ = this.store.pipe(select(getProductCategoriesEditorSaveError));
  productCategory$ = this.store.pipe(select(getProductCategoriesEditorCategory));
  isSaving$ = this.store.pipe(select(getProductCategoriesEditorIsSaving));
  isReadOnly$ = this.store.pipe(select(getProductCategoriesEditorIsReadOnly));
  isSaveEnabled$ = this.store.pipe(select(getProductCategoriesEditorIsSaveEnabled));

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.initProductCategory();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['category']) {
      if (this.form) {
        this.setFormValue(this.category);
      } else {
        this.initForm(this.category);
      }
    }
  }

  initForm(productCategory: ProductCategory) {
    this.form = new FormGroup(
      {
        name: new FormControl(null, { updateOn: 'change', validators: [Validators.required] }),
      },
      { updateOn: 'blur' },
    );
    this.setFormValue(productCategory);
    this.sub.add(
      this.form.valueChanges.subscribe(formValue => {
        const newCategory = setStateProperties(this.category, {
          ...formValue,
        });
        if (!isDeepEqual(this.category, newCategory)) {
          // Second check for infinite loop, since in Angular v5.2.7 form.patchValue(...,{emitEvent: false})
          // emits event no matter what
          // TODO: remove check once bug in Angular is fixed
          this.patchCategory(newCategory);
        }
      }),
    );
  }

  setFormValue(productCategory: ProductCategory): void {
    this.form.patchValue(productCategory, { emitEvent: false }); // Set value, but prevent infinite emit loop
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  initProductCategory() {
    if (this.category && this.category.id) {
      this.store.dispatch(new ProductCategoriesEditorItemLoadAction(this.category.id));
    } else {
      this.store.dispatch(new ProductCategoriesEditorCreateAction());
    }
  }

  cancel(): void {
    this.resulted.emit(true);
  }

  save(): void {
    this.store.dispatch(new ProductCategoriesEditorSaveAction());
    this.resulted.emit(false);
  }

  patchCategory(productCategoryData: Partial<ProductCategory>): void {
    this.store.dispatch(new ProductCategoriesEditorUpdateAction(productCategoryData));
  }
}
