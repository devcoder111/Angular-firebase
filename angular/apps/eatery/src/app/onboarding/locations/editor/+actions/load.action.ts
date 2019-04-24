import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Location } from '@shared/types/location.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap } from 'rxjs/operators';
import { unwrapDocSnapshotChanges } from '../../../../+shared/helpers/firestore.helper';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { LOCATIONS_STATE_FEATURE_NAME } from '../../locations-state.module';
import { LocationsState } from '../../locations.state';
import { LocationsEditorLoadLocationFailedAction } from './loadFailed.action';
import { LocationsEditorLoadSuccessfulAction } from './loadSuccessful.action';
import { LocationsEditorUpdateAction } from './update.action';

const type = generateActionType(LOCATIONS_STATE_FEATURE_NAME, 'Editor - Load');

export class LocationsEditorItemLoadAction implements BaseAction<LocationsState> {
  feature = LOCATIONS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: string) {}

  handler(state: LocationsState): LocationsState {
    const editor = setStateProperties(state.editor, {
      isLoadingLocation: true,
      location: null,
      loadLocationError: null,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class LocationsEditorLoadActionEffect {
  @Effect()
  watchItem$ = this.actions$.pipe(
    ofType(type),
    switchMap((action: LocationsEditorItemLoadAction) =>
      this.db
        .doc<Location>(`${CollectionNames.locations}/${action.payload}`)
        .snapshotChanges()
        .pipe(
          map(unwrapDocSnapshotChanges),
          map(
            (item: Location, indexOfEvent: number) =>
              indexOfEvent === 0 // if first time
                ? new LocationsEditorLoadSuccessfulAction(item)
                : new LocationsEditorUpdateAction(item),
          ),
          catchError(error => of(new LocationsEditorLoadLocationFailedAction(error))),
          // TODO for Anton: Unsubscribe when user leaves /locations/:id
        ),
    ),
  );

  constructor(private actions$: Actions, private db: AngularFirestore) {}
}
