import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Location } from '@shared/types/location.interface';
import { AngularFirestore } from 'angularfire2/firestore';
import { map, withLatestFrom } from 'rxjs/operators';
import { AppState } from '../../../../+core/store/app.state';
import { getActiveOrganizationId, getUser } from '../../../../+core/store/selectors';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { LOCATIONS_STATE_FEATURE_NAME } from '../../locations-state.module';
import { LocationsState } from '../../locations.state';
import { LocationsEditorCreateSuccessfulAction } from './createSuccessful.action';

const type = generateActionType(LOCATIONS_STATE_FEATURE_NAME, 'Editor - Create');

export class LocationsEditorCreateAction implements BaseAction<LocationsState> {
  feature = LOCATIONS_STATE_FEATURE_NAME;
  type = type;

  handler(state: LocationsState): LocationsState {
    const editor = setStateProperties(state.editor, {
      isLoadingLocation: true,
      isNew: true,
      location: null,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class LocationsEditorCreateActionEffect {
  @Effect()
  create$ = this.actions$.pipe(
    ofType(type),
    withLatestFrom(this.store, (action, state) => state),
    map((state: AppState) => {
      const item: Location = {
        id: this.db.createId(),
        name: null,
        code: null,
        details: null,
        availableForUsers: [getUser(state).id],
        createdAt: new Date(),
        createdBy: getUser(state).id,
        isDeleted: false,
        address: null,
        organizationId: getActiveOrganizationId(state),
      };
      return new LocationsEditorCreateSuccessfulAction(item);
    }),
    // no catchError here, because "create" operation is local and sync, so "failed" case is not possible.
  );

  constructor(private actions$: Actions, private db: AngularFirestore, private store: Store<AppState>) {}
}
