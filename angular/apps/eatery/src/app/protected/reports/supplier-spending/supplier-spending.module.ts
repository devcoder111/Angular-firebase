import { NgModule } from '@angular/core';
import { ProtectedSharedModule } from '../../+shared/shared.module';
import { SupplierSpendingRoutingModule } from './supplier-spending-routing.module';
import { SupplierSpendingReportStoreModule } from './supplier-spending-state.module';
import { SupplierSpendingReportComponent } from './supplier-spending.component';
import { MatDialogModule } from '@angular/material';
import { DialogComponent } from './dialog-ex/dialog-ex.component';

@NgModule({
  imports: [ProtectedSharedModule, SupplierSpendingRoutingModule, SupplierSpendingReportStoreModule, MatDialogModule],
  declarations: [SupplierSpendingReportComponent, DialogComponent],
  entryComponents: [DialogComponent],
})
export class SupplierSpendingReportModule {}
