import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { EntitySelectorDialogService } from '@libs/entity-selector/src/entity-selector-dialog.service';
import { select, Store } from '@ngrx/store';
import { Location } from '@shared/types/location.interface';
import { OrganizationSupplier } from '@shared/types/organizationSupplier.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { SuppliersSaveAction } from '../+actions/save.action';
import { AppState } from '../../../+core/store/app.state';
import { isActivePositionOrganization } from '../../../+core/store/selectors';
import { firestoreQueryStringStartsWith } from '../../../+shared/helpers/firestore.helper';
import { trackByFn } from '../../../../../../../shared/trackBy.helper';
import { SuppliersListLoadCollectionAction } from './+actions/loadCollection.action';
import { SuppliersListSetFilterAction } from './+actions/setFilter.action';
import {
  getSuppliersListArray,
  getSuppliersListFilter,
  getSuppliersListIsFilterUsed,
  getSuppliersListIsLoading,
  getSuppliersListLoadError,
} from './list.selectors';
import { SuppliersListFilter } from './listFilter.interface';
import { getCurrentUser } from '../../../../../../../shared/getUser.helper';
import { getSuppliersEditorCanBeModified } from '../editor/editor.selectors';

@Component({
  selector: 'fr-suppliers-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuppliersListComponent implements OnInit {
  suppliers$ = this.store.pipe(select(getSuppliersListArray));
  isLoading$ = this.store.pipe(select(getSuppliersListIsLoading));
  loadError$ = this.store.pipe(select(getSuppliersListLoadError));
  filter$ = this.store.pipe(select(getSuppliersListFilter));
  isFilterUsed$ = this.store.pipe(select(getSuppliersListIsFilterUsed));
  isActivePositionOrganization$ = this.store.pipe(select(isActivePositionOrganization));
  canBeModified$ = this.store.pipe(select(getSuppliersEditorCanBeModified));

  trackByFn = trackByFn;

  constructor(private store: Store<AppState>, private entitySelectorDialog: EntitySelectorDialogService) {}

  ngOnInit() {
    this.store.dispatch(new SuppliersListLoadCollectionAction());
  }

  setFilter(filter: SuppliersListFilter): void {
    this.store.dispatch(new SuppliersListSetFilterAction(filter));
  }

  getOrderMethods(supplier: OrganizationSupplier): string {
    return Object.keys(supplier.orderMethods)
      .map(om => om.toUpperCase())
      .join(', ');
  }

  async selectLocations(supplier: OrganizationSupplier) {
    const supplierCopy = { ...supplier } as OrganizationSupplier;
    const displayField = 'name';
    const userId = (await getCurrentUser(this.store)).id;
    const locations: Location[] = await this.entitySelectorDialog.show<Location>({
      title: 'Select locations to grant access right to the listed supplier',
      searchBoxPlaceholder: 'Search location',
      submitButtonText: 'Save',
      mode: 'multiple',
      selectedItems: Object.keys(supplierCopy.byLocation).map(id => ({ id })),
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
            .where('organizationId', '==', supplierCopy.organizationId);
          return query;
        },
      ],
      displayField,
    });
    if (!locations) {
      return;
    }
    supplierCopy.byLocation = locations.reduce((acc, cur) => ({ ...acc, [cur.id]: true }), {});
    this.store.dispatch(new SuppliersSaveAction(supplierCopy));
  }
}
