import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subscription } from 'rxjs/Subscription';
import { UserAuthErrorAction } from '../../+core/store/actions/userAuthError.action';
import { UserResetPasswordAction } from '../../+core/store/actions/userResetPasword.action';
import { AppState } from '../../+core/store/app.state';
import { getAuthError, getAuthState } from '../../+core/store/selectors';
import { AuthState } from '../../+core/store/types/authState.enum';
import { AdvancedEmailValidator } from '../../../../../../shared/validators.helper';

@Component({
  selector: 'fr-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  AuthState = AuthState;
  form: FormGroup;
  sub = new Subscription();
  authState$ = this.store.pipe(select(getAuthState));
  authError$ = this.store.pipe(select(getAuthError));

  constructor(private afAuth: AngularFireAuth, private store: Store<AppState>) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, AdvancedEmailValidator]),
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  async resetPassword() {
    if (this.form.invalid) {
      return;
    }
    try {
      this.store.dispatch(new UserResetPasswordAction());
      await this.afAuth.auth.sendPasswordResetEmail(this.form.controls['email'].value);
    } catch (err) {
      return this.store.dispatch(new UserAuthErrorAction(err.message));
    }
  }
}
