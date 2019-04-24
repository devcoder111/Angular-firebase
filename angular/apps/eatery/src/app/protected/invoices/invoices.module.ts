import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material';
import { ConfirmDialogModule } from '@libs/confirm-dialog';
import { FilterByFieldModule } from '@libs/filter-by-field';
import { ImagesPreviewerModule } from '@libs/images-previewer';
import { InvoiceHelpersModule } from '@libs/invoice-helpers';
import { MoneyModule } from '@libs/money';
import { ProtectedSharedModule } from '../+shared/shared.module';
import { InvoicesEditorComponent } from './editor/editor.component';
import { InvoicesEditorAdjustmentsAdjustmentComponent } from './editor/form/adjustment/adjustment.component';
import { InvoicesEditorFormComponent } from './editor/form/form.component';
import { InvoicesEditorProductsProductComponent } from './editor/form/product/product.component';
import { InvoiceImagesCarouselComponent } from './editor/images-carousel/invoice-images-carousel.component';

import { InvoicesRoutingModule } from './invoices-routing.module';
import { InvoicesStoreModule } from './invoices-state.module';
import { InvoicesListFilterComponent } from './list/filter/filter.component';
import { InvoicesListComponent } from './list/list.component';
import { InvoicesUploadComponent } from './upload/upload.component';
import { SortablejsModule } from 'angular-sortablejs';

@NgModule({
  imports: [
    ProtectedSharedModule,
    InvoicesRoutingModule,
    InvoicesStoreModule,
    MatDialogModule,
    ImagesPreviewerModule,
    SortablejsModule,
    ConfirmDialogModule,
    InvoiceHelpersModule,
    MoneyModule,
    FilterByFieldModule,
  ],
  declarations: [
    InvoicesListComponent,
    InvoicesListFilterComponent,
    InvoicesEditorComponent,
    InvoicesEditorFormComponent,
    InvoicesEditorProductsProductComponent,
    InvoicesEditorAdjustmentsAdjustmentComponent,
    InvoiceImagesCarouselComponent,
    InvoicesUploadComponent,
  ],
})
export class InvoicesModule {}
