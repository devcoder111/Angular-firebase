import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Organization } from '@shared/types/organization.interface';
import { filter, map, withLatestFrom } from 'rxjs/operators';
import { BaseAction, generateActionType } from '../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { AppState } from '../app.state';
import { CoreState } from '../core.state';
import { FEATURE_NAME } from '../module';
import { getActiveOrganizationId, getOrganizationIds } from '../selectors';
import { AuthState } from '../types/authState.enum';
import { OrganizationsSetActiveItemIdAction } from './organizationsSetActiveItemId.action';

const type = generateActionType(FEATURE_NAME, 'Organizations - Set collection');

export class OrganizationsSetCollectionAction implements BaseAction<CoreState> {
  feature = FEATURE_NAME;
  type = type;

  constructor(public payload: Organization[]) {}

  handler(state: CoreState, action: this): CoreState {
    let authState = state.authState;
    if (state.authState === AuthState.userProfileLoading && action.payload.length) {
      authState = AuthState.organizationLoaded;
    }

    const organizations = setStateProperties(state.organizations, {
      ids: action.payload.map(item => item.id),
      items: action.payload.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {}),
    });
    return setStateProperties(state, { organizations, authState });
  }
}

@Injectable()
export class OrganizationsSetCollectionActionEffect {
  @Effect()
  setActiveOrganization$ = this.actions$.pipe(
    ofType(type),
    withLatestFrom(this.store, (action, state) => state),
    map(state => {
      const activeOrganizationId = getActiveOrganizationId(state);
      const organizationIds = getOrganizationIds(state);
      if (!organizationIds.length) {
        return { organizationId: null, saveToDB: false };
      } else if (organizationIds.indexOf(activeOrganizationId) === -1) {
        return { organizationId: organizationIds[0], saveToDB: true };
      } else {
        return { organizationId: activeOrganizationId, saveToDB: false };
      }
    }),
    filter((data: { organizationId: string; saveToDB: boolean }) => !!data.organizationId),
    map((data: { organizationId: string; saveToDB: boolean }) => {
      const { organizationId, saveToDB } = data;
      return new OrganizationsSetActiveItemIdAction({ organizationId, shouldNotify: false, saveToDB });
    }),
  );

  constructor(private actions$: Actions, private store: Store<AppState>) {}
}
