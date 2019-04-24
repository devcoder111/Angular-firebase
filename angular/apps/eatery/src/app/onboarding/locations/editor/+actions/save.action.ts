import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { switchMap, withLatestFrom } from 'rxjs/operators';
import { AppState } from '../../../../+core/store/app.state';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { LOCATIONS_STATE_FEATURE_NAME } from '../../locations-state.module';
import { LocationsState } from '../../locations.state';
import { getLocationsEditorState } from '../editor.selectors';
import { LocationsEditorState } from '../editor.state';
import { LocationsEditorSaveFailedAction } from './saveFailed.action';
import { LocationsEditorSaveSuccessfulAction } from './saveSuccessful.action';

const type = generateActionType(LOCATIONS_STATE_FEATURE_NAME, 'Editor - Save');

export class LocationsEditorSaveAction implements BaseAction<LocationsState> {
  feature = LOCATIONS_STATE_FEATURE_NAME;
  type = type;

  handler(state: LocationsState): LocationsState {
    const editor = setStateProperties(state.editor, {
      isSaving: true,
      saveError: null,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class LocationsEditorSaveActionEffect {
  @Effect()
  save$ = this.actions$.pipe(
    ofType(type),
    withLatestFrom(this.store, (action, state) => ({
      editor: getLocationsEditorState(state),
    })),
    switchMap((data: { editor: LocationsEditorState }) => {
      const { editor } = data;
      const { id, ...model } = editor.location;
      return this.db
        .doc(`${CollectionNames.locations}/${id}`)
        .set(model)
        .then(() => new LocationsEditorSaveSuccessfulAction())
        .catch(error => new LocationsEditorSaveFailedAction(error));
    }),
  );

  constructor(private actions$: Actions, private db: AngularFirestore, private store: Store<AppState>) {}
}
