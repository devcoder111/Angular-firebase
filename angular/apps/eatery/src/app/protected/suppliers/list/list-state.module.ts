import { SuppliersListLoadCollectionActionEffect } from './+actions/loadCollection.action';

export class SuppliersListStateModule {
  static effects = [SuppliersListLoadCollectionActionEffect];
}
