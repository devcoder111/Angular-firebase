import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { EnvironmentType } from './environments/environment.interface';

if (environment.type === EnvironmentType.prod) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error('platformBrowserDynamic.bootstrapModule(AppModule) failed', err));
