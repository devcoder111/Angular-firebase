import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'price-change',
        loadChildren: './price-change/price-change.module#PriceChangeReportModule',
      },
      {
        path: 'supplier-spending',
        loadChildren: './supplier-spending/supplier-spending.module#SupplierSpendingReportModule',
      },
      {
        path: 'statement-of-accounts',
        loadChildren: './statement-of-accounts/statement-of-accounts.module#StatementOfAccountsReportModule',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
