import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OrderStatusTitleBySlugPipe } from '@libs/order-helpers/src/status-title-by-slug/status-title-by-slug.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [OrderStatusTitleBySlugPipe],
  exports: [OrderStatusTitleBySlugPipe],
})
export class OrderHelpersModule {}
