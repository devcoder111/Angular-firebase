import { NgModule } from '@angular/core';
import { EntitySelectorModule } from '@libs/entity-selector';
import { ProtectedSharedModule } from '../+shared/shared.module';
import { ReportsRoutingModule } from './reports-routing.module';

@NgModule({
  imports: [ProtectedSharedModule, EntitySelectorModule, ReportsRoutingModule],
  declarations: [],
})
export class ReportsModule {}
