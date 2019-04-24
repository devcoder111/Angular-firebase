import { OrdersEditorCreateActionEffect } from './+actions/create.action';
import { OrdersEditorCreateProductActionEffect } from './+actions/createProduct.action';
import { OrdersEditorCreateProductsFromRecentOrderEffect } from './+actions/createProductsFromRecentOrder.action';
import { OrdersEditorLoadActionEffect } from './+actions/load.action';
import { OrdersEditorLoadOrderFailedActionEffect } from './+actions/loadFailed.action';
import { OrdersEditorLoadProductsFailedActionEffect } from './+actions/loadProductsFailed.action';
import { OrdersEditorLoadRecentActionEffect } from './+actions/loadRecent.action';
import { OrdersEditorLoadRecentOrderFailedActionEffect } from './+actions/loadRecentFailed.action';
import { OrdersEditorRecentOrderProductsLoadActionEffect } from './+actions/loadRecentOrderProducts.actions';
import { OrdersEditorCreateSuccessfulActionEffect } from './+actions/loadRecentSuccessful.action';
import { OrdersEditorSupplierLoadActionEffect } from './+actions/loadSupplier.actions';
import { OrdersEditorLoadSupplierFailedActionEffect } from './+actions/loadSupplierFailed.action';
import { OrdersEditorSaveActionEffect } from './+actions/save.action';
import { OrdersEditorSaveFailedActionEffect } from './+actions/saveFailed.action';
import { OrdersEditorSaveSuccessfulActionEffect } from './+actions/saveSuccessful.action';

export class OrdersEditorStateModule {
  static effects = [
    OrdersEditorCreateActionEffect,
    OrdersEditorCreateProductActionEffect,
    OrdersEditorCreateProductsFromRecentOrderEffect,
    OrdersEditorLoadActionEffect,
    OrdersEditorLoadOrderFailedActionEffect,
    OrdersEditorLoadProductsFailedActionEffect,
    OrdersEditorLoadRecentActionEffect,
    OrdersEditorLoadRecentOrderFailedActionEffect,
    OrdersEditorRecentOrderProductsLoadActionEffect,
    OrdersEditorCreateSuccessfulActionEffect,
    OrdersEditorSupplierLoadActionEffect,
    OrdersEditorLoadSupplierFailedActionEffect,
    OrdersEditorSaveActionEffect,
    OrdersEditorSaveFailedActionEffect,
    OrdersEditorSaveSuccessfulActionEffect,
  ];
}
