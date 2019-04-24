import { NgModule } from '@angular/core';
import { ProtectedSharedModule } from '../../+shared/shared.module';
import { StatementOfAccountsRoutingModule } from './statement-of-accounts-routing.module';
import { StatementOfAccountsReportStoreModule } from './statement-of-accounts-state.module';
import { StatementOfAccountsReportComponent } from './statement-of-accounts.component';

@NgModule({
  imports: [ProtectedSharedModule, StatementOfAccountsRoutingModule, StatementOfAccountsReportStoreModule],
  declarations: [StatementOfAccountsReportComponent],
})
export class StatementOfAccountsReportModule {}
