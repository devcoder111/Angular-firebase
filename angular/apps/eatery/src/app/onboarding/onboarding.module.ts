import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../+shared/shared.module';
import { OnboardingRoutingModule } from './onboarding-routing.module';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { EmailActionsComponent } from './email-actions/email-actions.component';

@NgModule({
  imports: [CommonModule, SharedModule, OnboardingRoutingModule],
  declarations: [SignInComponent, SignUpComponent, ResetPasswordComponent, SetPasswordComponent, EmailActionsComponent],
})
export class OnboardingModule {}
