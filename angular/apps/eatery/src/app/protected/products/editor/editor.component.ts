import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { OrganizationProduct } from '@shared/types/organizationProduct.interface';
import { map, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { AppState } from '../../../+core/store/app.state';
import { ProductsEditorCreateAction } from './+actions/create.action';
import { ProductsEditorItemLoadAction } from './+actions/load.action';
import { ProductsEditorSaveAction } from './+actions/save.action';
import { ProductsEditorUpdateAction } from './+actions/update.action';
import {
  getProductsEditorCanBeModified,
  getProductsEditorCanBeSaved,
  getProductsEditorIsLoadingProduct,
  getProductsEditorIsNew,
  getProductsEditorIsSaveEnabled,
  getProductsEditorIsSaving,
  getProductsEditorLoadProductError,
  getProductsEditorProduct,
  getProductsEditorSaveError,
} from './editor.selectors';

@Component({
  selector: 'fr-products-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsEditorComponent implements OnInit, OnDestroy {
  sub = new Subscription();
  state$ = this.store;
  isNew$ = this.store.pipe(select(getProductsEditorIsNew));
  isLoadingProduct$ = this.store.pipe(select(getProductsEditorIsLoadingProduct));
  loadProductError$ = this.store.pipe(select(getProductsEditorLoadProductError));
  saveError$ = this.store.pipe(select(getProductsEditorSaveError));
  product$ = this.store.pipe(select(getProductsEditorProduct));
  isSaving$ = this.store.pipe(select(getProductsEditorIsSaving));
  isSaveEnabled$ = this.store.pipe(select(getProductsEditorIsSaveEnabled));
  canBeSaved$ = this.store.pipe(select(getProductsEditorCanBeSaved));
  canBeModified$ = this.store.pipe(select(getProductsEditorCanBeModified));

  constructor(private location: Location, private store: Store<AppState>, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.initProduct();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  initProduct() {
    this.sub.add(
      this.activatedRoute.params
        .pipe(
          map(params => params['id']),
          tap((id?: string) => {
            if (id) {
              this.store.dispatch(new ProductsEditorItemLoadAction(id));
            } else {
              this.store.dispatch(new ProductsEditorCreateAction());
            }
          }),
        )
        .subscribe(),
    );
  }

  cancel(): void {
    this.location.back();
  }

  save(): void {
    // TODO: remove this once bug with infinite loop in Angular is fixed
    setTimeout(() => {
      this.store.dispatch(new ProductsEditorSaveAction());
    });
  }

  patchProduct(productData: Partial<OrganizationProduct>): void {
    this.store.dispatch(new ProductsEditorUpdateAction(productData));
  }
}
