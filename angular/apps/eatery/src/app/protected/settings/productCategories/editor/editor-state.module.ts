import { ProductCategoriesCreateActionEffect } from './+actions/create.action';
import { ProductCategoriesEditorLoadActionEffect } from './+actions/load.action';
import { ProductCategoriesEditorSaveActionEffect } from './+actions/save.action';
import { ProductCategoriesEditorSaveFailedActionEffect } from './+actions/saveFailed.action';
import { ProductCategoriesEditorSaveSuccessfulActionEffect } from './+actions/saveSuccessful.action';

export class ProductCategoriesEditorStateModule {
  static effects = [
    ProductCategoriesEditorSaveActionEffect,
    ProductCategoriesEditorLoadActionEffect,
    ProductCategoriesEditorSaveSuccessfulActionEffect,
    ProductCategoriesCreateActionEffect,
    ProductCategoriesEditorSaveFailedActionEffect,
  ];
}
