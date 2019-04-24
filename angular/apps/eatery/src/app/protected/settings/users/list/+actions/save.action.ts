import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { CollectionNames } from '../../../../../../../../../../shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { tap } from 'rxjs/operators';
import { USERS_STATE_FEATURE_NAME } from '../../users-state.module';
import { ProtectedState } from '../../../../+store/state';
import { BaseAction, generateActionType } from '../../../../../+shared/helpers/state.helper';
import { Permission } from '@shared/types/permission.interface';
import { LoggerService } from '../../../../../+shared/services/logger.service';

const type = generateActionType(USERS_STATE_FEATURE_NAME, 'List - Save');

export class PermissionSaveAction implements BaseAction<ProtectedState> {
  feature = USERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: { permission: Partial<Permission>; message?: string }) {}

  handler(state: ProtectedState): ProtectedState {
    return state;
  }
}

@Injectable()
export class PermissionSaveActionEffect {
  @Effect({ dispatch: false })
  save$ = this.actions$.pipe(
    ofType(type),
    tap(async (action: PermissionSaveAction) => {
      const { id, ...permission } = action.payload.permission;
      try {
        await this.db.doc<Permission>(`${CollectionNames.permissions}/${id}`).update(permission);
        this.snackBar.open(
          action.payload.message || `User "${permission.displayName || permission.userId}" was updated.`,
          null,
          {
            duration: 2500,
          },
        );
      } catch (error) {
        this.logger.error(`UsersSaveActionEffect.save$ - Error saving user "${id}"`, error);
        this.snackBar.open(`User "${permission.displayName || permission.userId}" save failed.`, null, {
          duration: 2500,
        });
      }
    }),
  );

  constructor(
    private actions$: Actions,
    private db: AngularFirestore,
    private snackBar: MatSnackBar,
    private logger: LoggerService,
  ) {}
}
