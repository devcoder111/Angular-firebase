import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { EntitySelectorDialogService } from '@libs/entity-selector/src/entity-selector-dialog.service';
import { select, Store } from '@ngrx/store';
import { Location } from '@shared/types/location.interface';
import { OrganizationProduct } from '@shared/types/organizationProduct.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { ProductsChangeCategoryAction } from '../+actions/changeCategory.action';
import { ProductsSaveAction } from '../+actions/save.action';
import { getProductCategories } from '../../+store/selectors';
import { AppState } from '../../../+core/store/app.state';
import { isActivePositionOrganization } from '../../../+core/store/selectors';
import { firestoreQueryStringStartsWith } from '../../../+shared/helpers/firestore.helper';
import { trackByFn } from '../../../../../../../shared/trackBy.helper';
import { ProductsListLoadCollectionAction } from './+actions/loadCollection.action';
import { ProductsListSetFilterAction } from './+actions/setFilter.action';
import {
  getProductsListArray,
  getProductsListFilter,
  getProductsListIsFilterUsed,
  getProductsListIsLoading,
  getProductsListLoadError,
} from './list.selectors';
import { ProductsListFilter } from './listFilter.interface';
import { getCurrentUser } from '../../../../../../../shared/getUser.helper';
import { getProductsEditorCanBeModified } from '../editor/editor.selectors';

@Component({
  selector: 'fr-products-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsListComponent implements OnInit {
  products$ = this.store.pipe(select(getProductsListArray));
  isLoading$ = this.store.pipe(select(getProductsListIsLoading));
  loadError$ = this.store.pipe(select(getProductsListLoadError));
  filter$ = this.store.pipe(select(getProductsListFilter));
  isFilterUsed$ = this.store.pipe(select(getProductsListIsFilterUsed));
  productCategories$ = this.store.pipe(select(getProductCategories));
  isActivePositionOrganization$ = this.store.pipe(select(isActivePositionOrganization));
  canBeModified$ = this.store.pipe(select(getProductsEditorCanBeModified));

  trackByFn = trackByFn;

  constructor(private store: Store<AppState>, private entitySelectorDialog: EntitySelectorDialogService) {}

  ngOnInit() {
    this.store.dispatch(new ProductsListLoadCollectionAction());
  }

  setFilter(filter: ProductsListFilter): void {
    this.store.dispatch(new ProductsListSetFilterAction(filter));
  }

  onCategoryChange(product, newValue) {
    this.store.dispatch(
      new ProductsChangeCategoryAction({
        product: product,
        categoryId: newValue,
      }),
    );
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
    this.store.dispatch(new ProductsSaveAction(productCopy));
  }
}
