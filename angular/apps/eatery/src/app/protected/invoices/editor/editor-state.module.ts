import { InvoicesEditorCreateActionEffect } from './+actions/create.action';
import { InvoicesEditorCreateAdjustmentActionEffect } from './+actions/createAdjustment.action';
import { InvoicesEditorCreateProductActionEffect } from './+actions/createProduct.action';
import { InvoicesEditorLoadActionEffect } from './+actions/load.action';
import { InvoicesEditorLoadAdjustmentsFailedActionEffect } from './+actions/loadAdjustmentsFailed.action';
import { InvoicesEditorLoadFailedActionEffect } from './+actions/loadFailed.action';
import { InvoicesEditorLoadImagesFailedActionEffect } from './+actions/loadImagesFailed.action';
import { InvoicesEditorLoadProductsFailedActionEffect } from './+actions/loadProductsFailed.action';
import { InvoicesEditorSaveActionEffect } from './+actions/save.action';
import { InvoicesEditorSaveFailedActionEffect } from './+actions/saveFailed.action';
import { InvoicesEditorSaveSuccessfulActionEffect } from './+actions/saveSuccessful.action';
import { InvoicesEditorImagesLoadSuccessfulActionEffect } from './+actions/loadImagesSuccessful.action';
import { DeleteImageActionEffect } from './+actions/deleteImage.action';

export class InvoicesEditorStateModule {
  static effects = [
    InvoicesEditorCreateActionEffect,
    InvoicesEditorLoadActionEffect,
    InvoicesEditorLoadFailedActionEffect,
    InvoicesEditorSaveActionEffect,
    InvoicesEditorSaveSuccessfulActionEffect,
    InvoicesEditorSaveFailedActionEffect,
    InvoicesEditorCreateProductActionEffect,
    InvoicesEditorLoadProductsFailedActionEffect,
    InvoicesEditorLoadImagesFailedActionEffect,
    InvoicesEditorImagesLoadSuccessfulActionEffect,
    DeleteImageActionEffect,
    InvoicesEditorCreateAdjustmentActionEffect,
    InvoicesEditorLoadAdjustmentsFailedActionEffect,
  ];
}
