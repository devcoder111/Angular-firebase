import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { filter, map, tap, withLatestFrom } from 'rxjs/operators';
import { BaseAction, generateActionType } from '../../../+shared/helpers/state.helper';
import { LoggerService } from '../../../+shared/services/logger.service';
import { AppState } from '../app.state';
import { CoreState } from '../core.state';
import { FEATURE_NAME } from '../module';
import { getOrganizationItems, getUserConfig } from '../selectors';
import { OrganizationsLoadDataAction } from './organizationsLoadDataForOne.action';

const type = generateActionType(FEATURE_NAME, 'Organizations - Set activeItemId');

export class OrganizationsSetActiveItemIdAction implements BaseAction<CoreState> {
  feature = FEATURE_NAME;
  type = type;

  constructor(public payload: { organizationId: string; shouldNotify: boolean; saveToDB: boolean }) {}

  handler(state: CoreState): CoreState {
    return state;
  }
}

@Injectable()
export class OrganizationsSetActiveItemIdActionEffect {
  @Effect({ dispatch: false })
  updateActiveOrganizationInUserConfigDoc$ = this.actions$.pipe(
    ofType(type),
    filter((action: OrganizationsSetActiveItemIdAction) => !!action.payload.saveToDB),
    withLatestFrom(this.store, (action, state) => ({
      organizationId: action.payload.organizationId,
      userConfig: getUserConfig(state),
    })),
    tap((data: { organizationId; userConfig }) => {
      const { organizationId, userConfig } = data;
      return this.db
        .doc(`${CollectionNames.usersConfigs}/${userConfig.id}`)
        .update({
          activeOrganizationId: organizationId,
          activeLocationId: null,
        })
        .catch(error => {
          this.logger.error('OrganizationsSetActiveItemIdActionEffect.updateActiveOrganizationInUserConfigDoc$', error);
        });
    }),
  );

  @Effect({ dispatch: false })
  showNotification$ = this.actions$.pipe(
    ofType(type),
    filter((action: OrganizationsSetActiveItemIdAction) => !!action.payload.organizationId),
    withLatestFrom(this.store),
    map(([action, state]: [OrganizationsSetActiveItemIdAction, AppState]) => ({
      organization: getOrganizationItems(state)[action.payload.organizationId],
      shouldNotify: action.payload.shouldNotify,
    })),
    filter(({ shouldNotify }) => shouldNotify),
    tap(({ organization }) => {
      this.snackBar.open(`Organization is switched to "${organization.name}"`, null, { duration: 2500 });
    }),
  );

  @Effect()
  loadOrganizationData$ = this.actions$.pipe(
    ofType(type),
    filter((action: OrganizationsSetActiveItemIdAction) => !!action.payload.organizationId),
    map((action: OrganizationsSetActiveItemIdAction) => new OrganizationsLoadDataAction(action.payload.organizationId)),
  );

  constructor(
    private actions$: Actions,
    private db: AngularFirestore,
    private store: Store<AppState>,
    private snackBar: MatSnackBar,
    private logger: LoggerService,
  ) {}
}
