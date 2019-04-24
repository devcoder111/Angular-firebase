import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { BaseAction, generateActionType } from '../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { LoggerService } from '../../../+shared/services/logger.service';
import { CoreState } from '../core.state';
import { FEATURE_NAME } from '../module';

const type = generateActionType(FEATURE_NAME, 'Locations - List - Load collection failed');

export class LocationsListLoadCollectionFailedAction implements BaseAction<CoreState> {
  feature = FEATURE_NAME;
  type = type;

  constructor(public payload: Error) {}

  handler(state: CoreState, action: this): CoreState {
    const locations = setStateProperties(state.locations, {
      isLoading: false,
      loadError: action.payload,
    });
    return setStateProperties(state, { locations });
  }
}

@Injectable()
export class LocationsListLoadCollectionFailedActionEffect {
  @Effect()
  logError$ = this.actions$.pipe(
    ofType(type),
    tap((action: LocationsListLoadCollectionFailedAction) => {
      this.logger.error('LocationsListLoadCollectionFailedActionEffect.logError$', action.payload);
    }),
  );

  constructor(private actions$: Actions, private logger: LoggerService) {}
}
