import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ImagesPreviewerComponent } from '@libs/images-previewer/src/images-previewer.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ImagesPreviewerComponent],
  exports: [ImagesPreviewerComponent],
})
export class ImagesPreviewerModule {}
