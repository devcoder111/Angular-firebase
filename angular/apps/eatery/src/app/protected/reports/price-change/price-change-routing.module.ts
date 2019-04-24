import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PriceChangeReportComponent } from './price-change.component';

const routes: Routes = [
  {
    path: '',
    component: PriceChangeReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PriceChangeRoutingModule {}
