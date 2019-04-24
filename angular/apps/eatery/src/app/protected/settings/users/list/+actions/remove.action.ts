import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { timer } from 'rxjs/observable/timer';
import { tap } from 'rxjs/operators';
import { ProtectedState } from '../../../../+store/state';
import { Permission } from '@shared/types/permission.interface';
import { USERS_STATE_FEATURE_NAME } from '../../users-state.module';
import { BaseAction, generateActionType } from '../../../../../+shared/helpers/state.helper';
import { LoggerService } from '../../../../../+shared/services/logger.service';

const type = generateActionType(USERS_STATE_FEATURE_NAME, 'List - Remove');

export class PermissionRemoveAction implements BaseAction<ProtectedState> {
  feature = USERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: Permission) {}

  handler(state: ProtectedState): ProtectedState {
    return state;
  }
}

@Injectable()
export class PermissionRemoveActionEffect {
  @Effect({ dispatch: false })
  delete$ = this.actions$.pipe(
    ofType(type),
    tap((action: PermissionRemoveAction) => {
      const permission = action.payload;
      const snackBarRef = this.snackBar.open(
        `User ${permission.displayName || permission.userId} will be deleted in a moment`,
        'CANCEL',
        { duration: 3500 },
      );

      const deleteSub = timer(3500).subscribe(() =>
        this.db
          .doc(`${CollectionNames.permissions}/${permission.id}`)
          .delete()
          .catch(error => {
            this.logger.error('PermissionRemoveActionEffect.delete$', error);
            this.snackBar.open(`User wasn't deleted on the server. Error`, null, { duration: 2500 });
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
