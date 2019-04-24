import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ProductCategory } from '@shared/types/productCategory.interface';
import { AppState } from '../../../../+core/store/app.state';
import { trackByFn } from '../../../../../../../../shared/trackBy.helper';
import {
  canProductCategoryBeDeleted,
  canProductCategoryBeRestored,
  isProductCategoryLocked,
} from '../helpers/selectors.helpers';
import { ProductCategoriesListLoadCollectionAction } from './+actions/loadCollection.action';
import { ProductCategoriesRemoveAction } from './+actions/remove.action';
import { ProductCategoriesRestoreAction } from './+actions/restore.action';
import { ProductCategoriesListSetFilterAction } from './+actions/setFilter.action';
import {
  getProductCategoriesListArray,
  getProductCategoriesListFilter,
  getProductCategoriesListIsFilterUsed,
  getProductCategoriesListIsLoading,
  getProductCategoriesListLoadError,
} from './list.selectors';
import { ProductCategoriesListFilter } from './listFilter.interface';

@Component({
  selector: 'fr-product-categories-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCategoriesListComponent implements OnInit {
  productCategories$ = this.store.pipe(select(getProductCategoriesListArray));
  isLoading$ = this.store.pipe(select(getProductCategoriesListIsLoading));
  loadError$ = this.store.pipe(select(getProductCategoriesListLoadError));
  filter$ = this.store.pipe(select(getProductCategoriesListFilter));
  isFilterUsed$ = this.store.pipe(select(getProductCategoriesListIsFilterUsed));

  canBeDeleted = canProductCategoryBeDeleted;
  canBeRestored = canProductCategoryBeRestored;
  isLocked = isProductCategoryLocked;

  editing: string | null;

  trackByFn = trackByFn;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.dispatch(new ProductCategoriesListLoadCollectionAction());
  }

  startEdit(id) {
    this.editing = id;
  }

  stopEditing() {
    this.editing = null;
  }

  setFilter(filter: ProductCategoriesListFilter): void {
    this.store.dispatch(new ProductCategoriesListSetFilterAction(filter));
  }

  remove(productCategory: ProductCategory): void {
    this.store.dispatch(new ProductCategoriesRemoveAction(productCategory));
  }

  restore(productCategory: ProductCategory): void {
    this.store.dispatch(new ProductCategoriesRestoreAction(productCategory));
  }
}
