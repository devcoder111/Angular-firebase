import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatementOfAccountsReportComponent } from './statement-of-accounts.component';

const routes: Routes = [
  {
    path: '',
    component: StatementOfAccountsReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatementOfAccountsRoutingModule {}
