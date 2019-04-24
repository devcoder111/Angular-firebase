import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnboardingLocationsGuard } from './onboarding-locations.guard';
import { OnboardingPublicGuard } from './onboarding-public.guard';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { EmailActionsComponent } from './email-actions/email-actions.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'actions',
        component: EmailActionsComponent,
        canActivate: [OnboardingPublicGuard],
      },
      {
        path: 'sign-up',
        component: SignUpComponent,
        canActivate: [OnboardingPublicGuard],
      },
      {
        path: '',
        component: SignInComponent,
        canActivate: [OnboardingPublicGuard],
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
        canActivate: [OnboardingPublicGuard],
      },
      {
        path: 'set-password',
        component: SetPasswordComponent,
        canActivate: [OnboardingPublicGuard],
      },
      {
        path: 'locations',
        loadChildren: './locations/locations.module#LocationsModule',
        canActivate: [OnboardingLocationsGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [OnboardingPublicGuard, OnboardingLocationsGuard],
})
export class OnboardingRoutingModule {}
