import { OrdersListDownloadPDFForSelectedItemsActionEffect } from './+actions/downloadPDFForSelectedItems.action';
import { OrdersListLoadCollectionActionEffect } from './+actions/loadCollection.action';

export class OrdersListStateModule {
  static effects = [OrdersListLoadCollectionActionEffect, OrdersListDownloadPDFForSelectedItemsActionEffect];
}
