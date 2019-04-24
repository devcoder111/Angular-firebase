import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subscription } from 'rxjs/Subscription';
import { UserAuthErrorAction } from '../../+core/store/actions/userAuthError.action';
import { AppState } from '../../+core/store/app.state';
import { getAuthError, getAuthState, getEmailActionCode, getEmailActionEmail } from '../../+core/store/selectors';
import { AuthState } from '../../+core/store/types/authState.enum';
import { AdvancedEmailValidator } from '../../../../../../shared/validators.helper';
import { PasswordValidation } from '../sign-up/sign-up.component';
import { UserSetPasswordAction } from '../../+core/store/actions/userSetPassword.action';
import { ClearAuthErrorAction } from '../../+core/store/actions/clearAuthError.Action';

@Component({
  selector: 'fr-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetPasswordComponent implements OnInit, OnDestroy {
  AuthState = AuthState;
  form: FormGroup;
  sub = new Subscription();
  authState$ = this.store.pipe(select(getAuthState));
  authError$ = this.store.pipe(select(getAuthError));
  emailActionCode$ = this.store.pipe(select(getEmailActionCode));
  emailActionEmail$ = this.store.pipe(select(getEmailActionEmail));
  firebaseCode: string;

  constructor(private afAuth: AngularFireAuth, private store: Store<AppState>) {}

  ngOnInit() {
    this.form = new FormGroup(
      {
        email: new FormControl({ value: null, disabled: true }, [Validators.required, AdvancedEmailValidator]),
        password: new FormControl(null, [Validators.minLength(8), Validators.required]),
        confirmPassword: new FormControl(null, [Validators.required]),
      },
      { validators: [PasswordValidation.MatchPassword] },
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  goSingIn() {
    this.store.dispatch(new ClearAuthErrorAction(true));
  }

  async setNewPassword() {
    if (this.form.invalid) {
      return;
    }
    try {
      return this.store.dispatch(new UserSetPasswordAction({ newPassword: this.form.controls['password'].value }));
    } catch (err) {
      return this.store.dispatch(new UserAuthErrorAction(err.message));
    }
  }
}
