import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subscription } from 'rxjs/Subscription';
import { UserAuthErrorAction } from '../../+core/store/actions/userAuthError.action';
import { UserSignedOutAction } from '../../+core/store/actions/userSignedOut.action';
import { UserSignInAction } from '../../+core/store/actions/userSignIn.action';
import { AppState } from '../../+core/store/app.state';
import { getAuthError, getAuthState } from '../../+core/store/selectors';
import { AuthState } from '../../+core/store/types/authState.enum';
import { AdvancedEmailValidator } from '../../../../../../shared/validators.helper';

@Component({
  selector: 'fr-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent implements OnInit, OnDestroy {
  AuthState = AuthState;
  form: FormGroup;
  sub = new Subscription();
  authState$ = this.store.pipe(select(getAuthState));
  authError$ = this.store.pipe(select(getAuthError));

  constructor(private afAuth: AngularFireAuth, private store: Store<AppState>) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, AdvancedEmailValidator]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  async signIn() {
    if (this.form.invalid) {
      return;
    }
    try {
      this.store.dispatch(
        new UserSignInAction({
          email: this.form.controls['email'].value,
          password: this.form.controls['password'].value,
        }),
      );
      await this.afAuth.auth.signInWithEmailAndPassword(
        this.form.controls['email'].value,
        this.form.controls['password'].value,
      );
    } catch (err) {
      return this.store.dispatch(new UserAuthErrorAction(err.message));
    }
  }

  cancel() {
    this.store.dispatch(new UserSignedOutAction());
  }
}
