import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Location } from '@shared/types/location.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { tap } from 'rxjs/operators';
import { BaseAction, generateActionType } from '../../../+shared/helpers/state.helper';
import { LoggerService } from '../../../+shared/services/logger.service';
import { OnboardingState } from '../../onboarding.state';
import { LOCATIONS_STATE_FEATURE_NAME } from '../locations-state.module';

const type = generateActionType(LOCATIONS_STATE_FEATURE_NAME, 'Restored');

export class LocationsRestoreAction implements BaseAction<OnboardingState> {
  feature = LOCATIONS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: Location) {}

  handler(state: OnboardingState): OnboardingState {
    return state;
  }
}

@Injectable()
export class LocationsRestoreActionEffect {
  @Effect({ dispatch: false })
  markAsDraft$ = this.actions$.pipe(
    ofType(type),
    tap(async (action: LocationsRestoreAction) => {
      const location = action.payload;
      try {
        await this.db.doc<Location>(`${CollectionNames.locations}/${location.id}`).update({
          isDeleted: false,
        });
        this.snackBar.open(`Location "${location.name}" was restored.`, null, {
          duration: 2500,
        });
      } catch (error) {
        this.logger.error(
          `LocationsRestoreActionEffect.markAsDraft$ - Error restoring location "${location.name}":`,
          error,
        );
      }
      this.snackBar.open(`Location "${location.name}"restore failed.`, null, {
        duration: 2500,
      });
    }),
  );

  constructor(
    private actions$: Actions,
    private db: AngularFirestore,
    private snackBar: MatSnackBar,
    private logger: LoggerService,
  ) {}
}
