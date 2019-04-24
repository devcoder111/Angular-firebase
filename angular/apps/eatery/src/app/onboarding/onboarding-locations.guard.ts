import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { combineLatest as combineLatestOp, map } from 'rxjs/operators';
import { AppState } from '../+core/store/app.state';
import { getAuthState, isOwner } from '../+core/store/selectors';
import { AuthState } from '../+core/store/types/authState.enum';

@Injectable()
export class OnboardingLocationsGuard implements CanActivate {
  constructor(private store: Store<AppState>, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.store.pipe(
      combineLatestOp(this.store.pipe(select(getAuthState)), this.store.pipe(select(isOwner)), (
        state, // tslint:disable-line:no-shadowed-variable
        authState,
        isOwner, // tslint:disable-line:no-shadowed-variable
      ) => ({
        authState,
        isOwner,
      })),
      map((data: { authState; isOwner }) => {
        const { authState, isOwner } = data; // tslint:disable-line:no-shadowed-variable
        const locationsPageAllowed = authState === AuthState.organizationLoaded || authState === AuthState.authorized;
        if (!locationsPageAllowed || !isOwner) {
          this.router.navigate(['/onboarding']);
          return false;
        }
        return true;
      }),
    );
  }
}
