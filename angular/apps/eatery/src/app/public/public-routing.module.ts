import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TermsComponent } from './terms/terms.component';
import { PrivacyComponent } from './privacy/privacy.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'privacy',
        component: PrivacyComponent,
      },
      {
        path: 'terms',
        component: TermsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicRoutingModule {}
