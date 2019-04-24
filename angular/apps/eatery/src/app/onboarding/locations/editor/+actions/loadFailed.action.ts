import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { LoggerService } from '../../../../+shared/services/logger.service';
import { LOCATIONS_STATE_FEATURE_NAME } from '../../locations-state.module';
import { LocationsState } from '../../locations.state';

const type = generateActionType(LOCATIONS_STATE_FEATURE_NAME, 'Editor - Load location failed');

export class LocationsEditorLoadLocationFailedAction implements BaseAction<LocationsState> {
  feature = LOCATIONS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: Error) {}

  handler(state: LocationsState, action: this): LocationsState {
    const editor = setStateProperties(state.editor, {
      isLoadingLocation: false,
      loadLocationError: action.payload,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class LocationsEditorLoadLocationFailedActionEffect {
  @Effect()
  logError$ = this.actions$.pipe(
    ofType(type),
    tap((action: LocationsEditorLoadLocationFailedAction) => {
      this.logger.error('LocationsEditorLoadLocationFailedActionEffect.logError$', action.payload);
    }),
  );

  constructor(private actions$: Actions, private logger: LoggerService) {}
}
