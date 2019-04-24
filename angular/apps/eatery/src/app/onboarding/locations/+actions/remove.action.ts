import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Location } from '@shared/types/location.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { timer } from 'rxjs/observable/timer';
import { tap } from 'rxjs/operators';
import { BaseAction, generateActionType } from '../../../+shared/helpers/state.helper';
import { LoggerService } from '../../../+shared/services/logger.service';
import { OnboardingState } from '../../onboarding.state';
import { LOCATIONS_STATE_FEATURE_NAME } from '../locations-state.module';

const type = generateActionType(LOCATIONS_STATE_FEATURE_NAME, 'Remove');

export class LocationsRemoveAction implements BaseAction<OnboardingState> {
  feature = LOCATIONS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: Location) {}

  handler(state: OnboardingState): OnboardingState {
    return state;
  }
}

@Injectable()
export class LocationsRemoveActionEffect {
  @Effect({ dispatch: false })
  delete$ = this.actions$.pipe(
    ofType(type),
    tap((action: LocationsRemoveAction) => {
      const location = action.payload;
      const snackBarRef = this.snackBar.open(`Location "${location.name}" will be deleted in a moment`, 'CANCEL', {
        duration: 3500,
      });

      const deleteSub = timer(3500).subscribe(() =>
        this.db
          .doc<Location>(`${CollectionNames.locations}/${location.id}`)
          .update({ isDeleted: true })
          .catch(error => {
            this.logger.error('LocationsRemoveActionEffect.delete$ - Error deleting location', error);
            this.snackBar.open(`Location wasn't deleted on the server. Error`, null, { duration: 2500 });
          }),
      );

      const subAction = snackBarRef.onAction().subscribe(() => {
        deleteSub.unsubscribe();
      });
      setTimeout(() => {
        subAction.unsubscribe();
        deleteSub.unsubscribe();
      }, 3550); // this prevents next snackBar from not being opened
    }),
  );

  constructor(
    private actions$: Actions,
    private db: AngularFirestore,
    private snackBar: MatSnackBar,
    private logger: LoggerService,
  ) {}
}
