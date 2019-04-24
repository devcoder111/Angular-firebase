import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { EntitySelectorDialogService } from '@libs/entity-selector/src/entity-selector-dialog.service';
import { select, Store } from '@ngrx/store';
import {
  getUsersListArray,
  getUsersListCanBeModified,
  getUsersListFilter,
  getUsersListIsFilterUsed,
  getUsersListIsLoading,
  getUsersListLoadError,
} from './list.selectors';
import { AppState } from '../../../../+core/store/app.state';
import { UsersListLoadCollectionAction } from './+actions/loadCollection.action';
import { trackByFn } from '../../../../../../../../shared/trackBy.helper';
import { isActivePositionOrganization, isAdminOrOwner } from '../../../../+core/store/selectors';
import { Roles, RolesArray } from '@shared/values/roles.array';
import { Permission } from '@shared/types/permission.interface';
import { PermissionSaveAction } from './+actions/save.action';
import { PermissionRemoveAction } from './+actions/remove.action';
import { UsersListFilter } from './listFilter.interface';
import { UsersListSetFilterAction } from './+actions/setFilter.action';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { firestoreQueryStringStartsWith } from '../../../../+shared/helpers/firestore.helper';
import { Location } from '@shared/types/location.interface';
import { without } from '@shared/helpers/without/without.helper';

@Component({
  selector: 'fr-users-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent implements OnInit {
  users$ = this.store.pipe(select(getUsersListArray));
  isLoading$ = this.store.pipe(select(getUsersListIsLoading));
  loadError$ = this.store.pipe(select(getUsersListLoadError));
  filter$ = this.store.pipe(select(getUsersListFilter));
  isFilterUsed$ = this.store.pipe(select(getUsersListIsFilterUsed));
  isActivePositionOrganization$ = this.store.pipe(select(isActivePositionOrganization));
  canBeModified$ = this.store.pipe(select(getUsersListCanBeModified));
  trackByFn = trackByFn;

  constructor(private store: Store<AppState>, private entitySelectorDialog: EntitySelectorDialogService) {}

  ngOnInit() {
    this.store.dispatch(new UsersListLoadCollectionAction());
  }

  setFilter(filter: UsersListFilter): void {
    this.store.dispatch(new UsersListSetFilterAction(filter));
  }

  onRoleChange(permission: Permission, role) {
    this.store.dispatch(new PermissionSaveAction({ permission: { id: permission.id, role }, message: 'Role changed' }));
  }

  async selectLocations(permission: Permission) {
    const permissionCopy: Permission = { ...permission };
    const displayField = 'name';
    const locations: Location[] = await this.entitySelectorDialog.show<Location>({
      title: 'Select locations to grant access right to the listed user',
      searchBoxPlaceholder: 'Search locations',
      submitButtonText: 'Save',
      mode: 'multiple',
      selectedItems: permissionCopy.byLocations.map(id => ({ id })),
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
            .where('organizationId', '==', permissionCopy.organizationId);
          return query;
        },
      ],
      displayField,
    });
    if (!locations) {
      return;
    }
    permissionCopy.byLocations = locations.map(location => location.id);
    this.store.dispatch(new PermissionSaveAction({ permission: permissionCopy, message: 'Outlets updated' }));
  }

  getRoles(currentRole) {
    return currentRole === Roles.owner.slug ? [Roles.owner] : without(RolesArray, Roles.owner);
  }

  remove(permission) {
    this.store.dispatch(new PermissionRemoveAction(permission));
  }
}
