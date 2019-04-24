import { SuppliersEditorCreateActionEffect } from './+actions/create.action';
import { SuppliersEditorLoadActionEffect } from './+actions/load.action';
import { SuppliersEditorLoadSupplierFailedActionEffect } from './+actions/loadFailed.action';
import { SuppliersEditorSaveActionEffect } from './+actions/save.action';
import { SuppliersEditorSaveFailedActionEffect } from './+actions/saveFailed.action';
import { SuppliersEditorSaveSuccessfulActionEffect } from './+actions/saveSuccessful.action';

export class SuppliersEditorStateModule {
  static effects = [
    SuppliersEditorCreateActionEffect,
    SuppliersEditorLoadActionEffect,
    SuppliersEditorLoadSupplierFailedActionEffect,
    SuppliersEditorSaveActionEffect,
    SuppliersEditorSaveSuccessfulActionEffect,
    SuppliersEditorSaveFailedActionEffect,
  ];
}
