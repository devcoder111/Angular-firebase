import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfirmDialogModule } from '@libs/confirm-dialog';
import { EntitySelectorModule } from '@libs/entity-selector';
import { ProfileComponent } from './components/profile/profile.component';
import { AutofocusDirective } from './directives/autofocus.directive';
import { MaterialModule } from './material.module';
import { NotImplementedService } from './not-implemented/not-implemented.service';
import { TruncatePipe } from './pipes/truncate.pipe';
import { LoggerService } from './services/logger.service';

@NgModule({
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  declarations: [AutofocusDirective, ProfileComponent, TruncatePipe],
  exports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    AutofocusDirective,
    ProfileComponent,
    TruncatePipe,
    EntitySelectorModule,
    ConfirmDialogModule,
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [LoggerService, NotImplementedService],
    };
  }
}
