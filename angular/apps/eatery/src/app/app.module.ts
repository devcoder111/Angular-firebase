import { NgModule } from '@angular/core';
import { CoreModule } from './+core/core.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [CoreModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
