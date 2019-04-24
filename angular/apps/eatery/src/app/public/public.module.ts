import { NgModule } from '@angular/core';
import { PublicRoutingModule } from './public-routing.module';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsComponent } from './terms/terms.component';

@NgModule({
  imports: [PublicRoutingModule],
  declarations: [PrivacyComponent, TermsComponent],
})
export class PublicModule {}
