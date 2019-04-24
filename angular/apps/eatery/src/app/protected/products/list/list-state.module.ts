import { ProductsListLoadCollectionActionEffect } from './+actions/loadCollection.action';

export class ProductsListStateModule {
  static effects = [ProductsListLoadCollectionActionEffect];
}
