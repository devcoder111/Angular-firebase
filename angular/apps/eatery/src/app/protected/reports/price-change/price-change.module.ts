import { NgModule } from '@angular/core';
import { ProtectedSharedModule } from '../../+shared/shared.module';
import { PriceChangeRoutingModule } from './price-change-routing.module';
import { PriceChangeReportStoreModule } from './price-change-state.module';
import { PriceChangeReportComponent } from './price-change.component';

@NgModule({
  imports: [ProtectedSharedModule, PriceChangeRoutingModule, PriceChangeReportStoreModule],
  declarations: [PriceChangeReportComponent],
})
export class PriceChangeReportModule {}
