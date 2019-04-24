import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from 'firebase';
import * as LogRocket from 'logrocket';
import { withLatestFrom } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { EnvironmentType } from '../environments/environment.interface';
import { UserAuthenticatedAction } from './+core/store/actions/userAuthenticated.action';
import { UserSignedOutAction } from './+core/store/actions/userSignedOut.action';
import { AppState } from './+core/store/app.state';
import { isNotAuthenticated } from './+core/store/selectors';
import { LoggerService } from './+shared/services/logger.service';

if (environment.type === EnvironmentType.prod && environment.logRocket) {
  LogRocket.init(environment.logRocket);
}

@Component({
  selector: 'fr-root',
  template: `<router-outlet></router-outlet>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  constructor(private afAuth: AngularFireAuth, private store: Store<AppState>, private logger: LoggerService) {}

  ngOnInit() {
    this.afAuth.authState
      .pipe(withLatestFrom(this.store, (user, state) => ({ user, isUserNotAuthenticated: isNotAuthenticated(state) })))
      .subscribe((params: { user: User; isUserNotAuthenticated: boolean }) => {
        const { user, isUserNotAuthenticated } = params;
        if (!user) {
          if (isUserNotAuthenticated) {
            return; // app state is already clean
          } else {
            return this.store.dispatch(new UserSignedOutAction()); // need to clean app state
          }
        }
        if (environment.type === EnvironmentType.prod) {
          LogRocket.identify(user.uid, {
            email: user.email,
            name: user.displayName,
          });
        }
        this.store.dispatch(new UserAuthenticatedAction(user));
      });
    this.logger.debug('AppComponent.ngOnInit - Environment:', environment);
  }
}
