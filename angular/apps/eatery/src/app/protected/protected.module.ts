import { NgModule } from '@angular/core';
import { ProtectedSharedModule } from './+shared/shared.module';
import { ProtectedStoreModule } from './+store/module';
import { ProtectedRoutingModule } from './protected-routing.module';
import { ProtectedComponent } from './protected.component';

@NgModule({
  imports: [ProtectedSharedModule, ProtectedRoutingModule, ProtectedStoreModule],
  declarations: [ProtectedComponent],
})
export class ProtectedModule {}
