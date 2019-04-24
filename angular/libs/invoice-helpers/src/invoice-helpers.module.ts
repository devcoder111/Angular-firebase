import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InvoiceStatusTitleBySlugPipe } from '@libs/invoice-helpers/src/status-title-by-slug/status-title-by-slug.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [InvoiceStatusTitleBySlugPipe],
  exports: [InvoiceStatusTitleBySlugPipe],
})
export class InvoiceHelpersModule {}
