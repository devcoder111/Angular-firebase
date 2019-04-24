import { UsersListLoadCollectionActionEffect } from './+actions/loadCollection.action';
import { PermissionSaveActionEffect } from './+actions/save.action';
import { PermissionRemoveActionEffect } from './+actions/remove.action';

export class UsersListStateModule {
  static effects = [UsersListLoadCollectionActionEffect, PermissionSaveActionEffect, PermissionRemoveActionEffect];
}
