import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupplierSpendingReportComponent } from './supplier-spending.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierSpendingReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupplierSpendingRoutingModule {}
