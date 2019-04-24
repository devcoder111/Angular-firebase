import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatButtonModule, MatDialogModule, MatInputModule } from '@angular/material';

import { ConfirmDialogComponent, ConfirmDialogWithTextComponent } from './confirm-dialog.component';
import { ConfirmDialogService } from './confirm-dialog.service';

@NgModule({
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatInputModule],
  declarations: [ConfirmDialogComponent, ConfirmDialogWithTextComponent],
  entryComponents: [ConfirmDialogComponent, ConfirmDialogWithTextComponent],
})
export class ConfirmDialogModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ConfirmDialogModule,
      providers: [ConfirmDialogService],
    };
  }
}
