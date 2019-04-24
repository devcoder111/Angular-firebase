import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subscription } from 'rxjs/Subscription';
import { AppState } from '../../+core/store/app.state';
import { AuthState } from '../../+core/store/types/authState.enum';
import { ActivatedRoute } from '@angular/router';
import { UserEmailActionsAction } from '../../+core/store/actions/userEmailActions.action';
import { ClearAuthErrorAction } from '../../+core/store/actions/clearAuthError.Action';
import { getAuthError, getAuthState } from '../../+core/store/selectors';

@Component({
  selector: 'fr-email-actions',
  templateUrl: './email-actions.component.html',
  styleUrls: ['./email-actions.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailActionsComponent implements OnDestroy {
  AuthState = AuthState;
  sub = new Subscription();
  authState$ = this.store.pipe(select(getAuthState));
  authError$ = this.store.pipe(select(getAuthError));

  constructor(private afAuth: AngularFireAuth, private store: Store<AppState>, private activatedRoute: ActivatedRoute) {
    this.sub.add(
      this.activatedRoute.queryParams.subscribe(params => {
        if (params['mode'] && params['oobCode'])
          this.store.dispatch(
            new UserEmailActionsAction({ actionMode: params['mode'], actionCode: params['oobCode'] }),
          );
      }),
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  tryAgain() {
    this.store.dispatch(new ClearAuthErrorAction(true));
  }
}
