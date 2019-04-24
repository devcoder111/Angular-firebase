import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'public',
    loadChildren: '../public/public.module#PublicModule',
  },
  {
    path: 'onboarding',
    loadChildren: '../onboarding/onboarding.module#OnboardingModule',
  },
  {
    path: '',
    loadChildren: '../protected/protected.module#ProtectedModule',
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
