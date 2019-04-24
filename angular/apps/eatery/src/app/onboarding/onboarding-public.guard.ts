import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { AppState } from '../+core/store/app.state';
import { getAuthState } from '../+core/store/selectors';
import { AuthState } from '../+core/store/types/authState.enum';

@Injectable()
export class OnboardingPublicGuard implements CanActivate {
  constructor(private store: Store<AppState>, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.store.pipe(
      select(getAuthState),
      map(authState => {
        if (authState === AuthState.organizationLoaded) {
          this.router.navigate(['/onboarding/locations']);
          return false;
        }
        if (authState === AuthState.authorized) {
          this.router.navigate(['/']);
          return false;
        }
        return true;
      }),
    );
  }
}
