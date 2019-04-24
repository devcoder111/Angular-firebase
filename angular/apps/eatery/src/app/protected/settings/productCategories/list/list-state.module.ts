import { ProductCategoriesListLoadCollectionActionEffect } from './+actions/loadCollection.action';
import { ProductCategoriesRemoveActionEffect } from './+actions/remove.action';
import { ProductCategoriesRestoreActionEffect } from './+actions/restore.action';

export class ProductCategoriesListStateModule {
  static effects = [
    ProductCategoriesListLoadCollectionActionEffect,
    ProductCategoriesRemoveActionEffect,
    ProductCategoriesRestoreActionEffect,
  ];
}
