import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Location } from '@shared/types/location.interface';
import { filter, map, tap, withLatestFrom } from 'rxjs/operators';
import { BaseAction, generateActionType } from '../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { ProtectedInitAction } from '../../../protected/+store/actions/init.action';
import { getProtectedState } from '../../../protected/+store/selectors';
import { AppState } from '../app.state';
import { CoreState } from '../core.state';
import { FEATURE_NAME } from '../module';
import {
  getActiveLocationId,
  getAuthState,
  getLocationsInActiveOrganization,
  getLocationsListItemsMap,
  isAuthorized,
} from '../selectors';
import { AuthState } from '../types/authState.enum';
import { LocationsSetActiveItemIdAction } from './locationsSetActiveItemId.action';

const type = generateActionType(FEATURE_NAME, 'Locations - List - Set collection');

export class LocationsListSetCollectionAction implements BaseAction<CoreState> {
  feature = FEATURE_NAME;
  type = type;

  constructor(public payload: Location[]) {}

  handler(state: CoreState, action: this): CoreState {
    let authState = state.authState;
    if (state.authState === AuthState.organizationLoaded && action.payload.length) {
      authState = AuthState.authorized;
    }

    const locations = setStateProperties(state.locations, {
      ids: action.payload.map(item => item.id),
      items: action.payload.reduce((items, item) => ({ ...items, [item.id]: item }), {}),
      isLoading: false,
      loadError: null,
    });
    return setStateProperties(state, { locations, authState });
  }
}

@Injectable()
export class LocationsSetCollectionActionEffect {
  @Effect()
  setActiveLocation$ = this.actions$.pipe(
    ofType(type),
    withLatestFrom(this.store, (action, state) => state),
    map(state => {
      const activeLocationId = getActiveLocationId(state);
      if (!getLocationsInActiveOrganization(state).length || activeLocationId === null) {
        return null;
      } else {
        return getLocationsListItemsMap(state)[activeLocationId];
      }
    }),
    filter(v => !!v),
    map(location => new LocationsSetActiveItemIdAction({ location, shouldNotify: false })),
  );

  @Effect()
  protectedInit$ = this.actions$.pipe(
    ofType(type),
    withLatestFrom(
      this.store.pipe(select(isAuthorized)),
      this.store.pipe(select(getProtectedState)),
      (action: LocationsListSetCollectionAction, isAuth, protectedState) => ({ isAuth, protectedState }),
    ),
    filter(
      (data: { isAuth; protectedState }) =>
        !!data.isAuth &&
        !(
          data.protectedState.unitTypes &&
          data.protectedState.unitTypes.ids &&
          data.protectedState.unitTypes.ids.length
        ),
    ),
    map(() => new ProtectedInitAction()),
  );

  @Effect({ dispatch: false })
  redirectToLocations$ = this.actions$.pipe(
    ofType(type),
    withLatestFrom(this.store.pipe(select(getAuthState)), (action: LocationsListSetCollectionAction, authState) => ({
      authState,
    })),
    tap((data: { authState: AuthState }) => {
      const { authState } = data;
      if (this.router.url === '/onboarding') {
        if (authState === AuthState.authorized) {
          return this.router.navigate(['/']);
        } else {
          return this.router.navigate(['/onboarding/locations']);
        }
      }
    }),
  );

  constructor(private actions$: Actions, private router: Router, private store: Store<AppState>) {}
}
