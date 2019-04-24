import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { LoggerService } from '../../../../+shared/services/logger.service';
import { LOCATIONS_STATE_FEATURE_NAME } from '../../locations-state.module';
import { LocationsState } from '../../locations.state';

const type = generateActionType(LOCATIONS_STATE_FEATURE_NAME, 'Editor - Save failed');

export class LocationsEditorSaveFailedAction implements BaseAction<LocationsState> {
  feature = LOCATIONS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: Error) {}

  handler(state: LocationsState, action: this): LocationsState {
    const editor = setStateProperties(state.editor, {
      isSaving: false,
      saveError: action.payload,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class LocationsEditorSaveFailedActionEffect {
  @Effect({ dispatch: false })
  saveFailed$ = this.actions$.pipe(
    ofType(type),
    tap((action: LocationsEditorSaveFailedAction) => {
      this.logger.error('LocationsEditorSaveFailedActionEffect.saveFailed$', action.payload);
      this.snackBar.open(`Location save failed`, null, { duration: 2500 });
    }),
  );

  constructor(private actions$: Actions, private snackBar: MatSnackBar, private logger: LoggerService) {}
}
