import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { JobTitles } from '@shared/values/jobTitles.array';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserAuthErrorAction } from '../../+core/store/actions/userAuthError.action';
import { UserSignUpAction } from '../../+core/store/actions/userSignUp.action';
import { AppState } from '../../+core/store/app.state';
import { UserCustomFields } from '../../+core/store/core.state';
import { getAuthError, getAuthState, getResendDate } from '../../+core/store/selectors';
import { AuthState } from '../../+core/store/types/authState.enum';
import { AdvancedEmailValidator } from '../../../../../../shared/validators.helper';
import { UserSetResendEmailTimeActionAction } from '../../+core/store/actions/userSetResendEmailTime.action';
import { ClearAuthErrorAction } from '../../+core/store/actions/clearAuthError.Action';
import { filter, map, share, switchMap, takeWhile } from 'rxjs/operators';
import { interval } from 'rxjs/observable/interval';

export class PasswordValidation {
  static MatchPassword(form: AbstractControl) {
    const password = form.get('password').value;
    const confirmPassword = form.get('confirmPassword').value;
    if (password !== confirmPassword) {
      form.get('confirmPassword').setErrors({ matchPassword: true });
    } else {
      return null;
    }
  }
}

// TODO: Privacy Policy & Terms
@Component({
  selector: 'fr-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent implements OnInit, OnDestroy {
  AuthState = AuthState;
  jobTitles = JobTitles;
  form: FormGroup;
  authState$ = this.store.pipe(select(getAuthState));
  authError$ = this.store.pipe(select(getAuthError));
  secondsToResendEmail$ = this.store.pipe(
    select(getResendDate),
    filter(v => !!v),
    switchMap(date =>
      interval(1000).pipe(
        map(() => 60 - Math.round((new Date().getTime() - date.getTime()) / 1000)),
        takeWhile(i => i > -1),
      ),
    ),
    share(),
  );

  constructor(private afAuth: AngularFireAuth, private store: Store<AppState>, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.form = new FormGroup(
      {
        displayName: new FormControl(null, Validators.required),
        jobTitle: new FormControl(null, Validators.required),
        email: new FormControl(null, [Validators.required, AdvancedEmailValidator]),
        password: new FormControl(null, [Validators.minLength(8), Validators.required]),
        confirmPassword: new FormControl(null, [Validators.required]),
        confirmTermsAndPrivacy: new FormControl(null, Validators.requiredTrue),
      },
      { validators: [PasswordValidation.MatchPassword] },
    );
  }

  async signUp() {
    if (this.form.invalid) {
      return;
    }
    try {
      await this.afAuth.auth.createUserWithEmailAndPassword(
        this.form.controls['email'].value,
        this.form.controls['password'].value,
      );
      await this.afAuth.auth.currentUser.sendEmailVerification();
      this.store.dispatch(new UserSetResendEmailTimeActionAction({ date: new Date() }));
    } catch (err) {
      return this.store.dispatch(new UserAuthErrorAction(err.message));
    }
    const userDetails: UserCustomFields = {
      displayName: this.form.controls['displayName'].value,
      jobTitle: this.form.controls['jobTitle'].value,
    };
    this.store.dispatch(new UserSignUpAction(userDetails));
  }

  async resendEmailVerification() {
    await this.afAuth.auth.currentUser.sendEmailVerification();
    this.store.dispatch(new UserSetResendEmailTimeActionAction({ date: new Date() }));
  }

  tryAgain() {
    this.store.dispatch(new ClearAuthErrorAction(false));
  }

  goSingIn() {
    this.store.dispatch(new ClearAuthErrorAction(true));
  }
  ngOnDestroy() {}
}
