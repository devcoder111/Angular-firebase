import { ProductsEditorCreateActionEffect } from './+actions/create.action';
import { ProductsEditorLoadActionEffect } from './+actions/load.action';
import { ProductsEditorLoadProductFailedActionEffect } from './+actions/loadFailed.action';
import { ProductsEditorSaveActionEffect } from './+actions/save.action';
import { ProductsEditorSaveFailedActionEffect } from './+actions/saveFailed.action';
import { ProductsEditorSaveSuccessfulActionEffect } from './+actions/saveSuccessful.action';

export class ProductsEditorStateModule {
  static effects = [
    ProductsEditorCreateActionEffect,
    ProductsEditorLoadActionEffect,
    ProductsEditorLoadProductFailedActionEffect,
    ProductsEditorSaveActionEffect,
    ProductsEditorSaveSuccessfulActionEffect,
    ProductsEditorSaveFailedActionEffect,
  ];
}
