import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { LOCATIONS_STATE_FEATURE_NAME } from '../../locations-state.module';
import { LocationsState } from '../../locations.state';

const type = generateActionType(LOCATIONS_STATE_FEATURE_NAME, 'Editor - Save successful');

export class LocationsEditorSaveSuccessfulAction implements BaseAction<LocationsState> {
  feature = LOCATIONS_STATE_FEATURE_NAME;
  type = type;

  handler(state: LocationsState): LocationsState {
    const editor = setStateProperties(state.editor, {
      isSaving: false,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class LocationsEditorSaveSuccessfulActionEffect {
  @Effect({ dispatch: false })
  saveSuccessful$ = this.actions$.pipe(
    ofType(type),
    tap(() => {
      this.snackBar.open(`Location was saved`, null, { duration: 2500 });
    }),
  );

  constructor(private actions$: Actions, private snackBar: MatSnackBar) {}
}
