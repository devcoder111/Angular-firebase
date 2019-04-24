import { NgModule } from '@angular/core';
import { ProtectedSharedModule } from '../+shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardStoreModule } from './dashboard-state.module';
import { DashboardComponent } from './dashboard.component';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  imports: [ProtectedSharedModule, DashboardRoutingModule, DashboardStoreModule, FormsModule, NgxChartsModule],
  declarations: [DashboardComponent],
})
export class DashboardModule {}
