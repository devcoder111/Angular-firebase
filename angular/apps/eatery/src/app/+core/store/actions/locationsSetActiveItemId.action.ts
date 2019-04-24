import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Location } from '@shared/types/location.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { filter, tap, withLatestFrom } from 'rxjs/operators';
import { BaseAction, generateActionType } from '../../../+shared/helpers/state.helper';
import { LoggerService } from '../../../+shared/services/logger.service';
import { AppState } from '../app.state';
import { CoreState } from '../core.state';
import { FEATURE_NAME } from '../module';
import { getLocationsListItemsMap, getUserConfig } from '../selectors';

const type = generateActionType(FEATURE_NAME, 'Locations - Set activeItemId');

export class LocationsSetActiveItemIdAction implements BaseAction<CoreState> {
  feature = FEATURE_NAME;
  type = type;

  constructor(public payload: { location: Location; shouldNotify: boolean; shouldRedirect?: boolean }) {}

  handler(state: CoreState): CoreState {
    return state;
  }
}

@Injectable()
export class LocationsSetActiveItemIdActionEffect {
  @Effect({ dispatch: false })
  updateActiveLocationInUserConfigDoc$ = this.actions$.pipe(
    ofType(type),
    withLatestFrom(this.store, (action: LocationsSetActiveItemIdAction, state) => ({
      locationId: action.payload.location ? action.payload.location.id : null,
      organizationId: action.payload.location ? action.payload.location.organizationId : null,
      userConfig: getUserConfig(state),
    })),
    tap(({ locationId, organizationId, userConfig }) =>
      this.db
        .doc(`${CollectionNames.usersConfigs}/${userConfig.id}`)
        .update({
          activeLocationId: locationId,
          activeOrganizationId: organizationId,
        })
        .catch(error => {
          this.logger.error('LocationsSetActiveItemIdActionEffect.updateActiveLocationInUserConfigDoc$', error);
        }),
    ),
  );

  @Effect({ dispatch: false })
  showNotification$ = this.actions$.pipe(
    ofType(type),
    withLatestFrom(this.store, (action: LocationsSetActiveItemIdAction, state) => ({
      location: getLocationsListItemsMap(state)[action.payload.location ? action.payload.location.id : null],
      shouldNotify: action.payload.shouldNotify,
    })),
    filter(({ shouldNotify }) => shouldNotify),
    tap(({ location }) => {
      this.snackBar.open(`Location is switched to "${location.name}"`, null, {
        duration: 2500,
      });
    }),
  );

  @Effect({ dispatch: false })
  redirect$ = this.actions$.pipe(
    ofType(type),
    filter((action: LocationsSetActiveItemIdAction) => !!action.payload.shouldRedirect),
    tap(() => this.router.navigate(['/'])),
  );

  constructor(
    private actions$: Actions,
    private db: AngularFirestore,
    private store: Store<AppState>,
    private snackBar: MatSnackBar,
    private logger: LoggerService,
    private router: Router,
  ) {}
}
