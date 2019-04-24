import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { OrganizationSupplier } from '@shared/types/organizationSupplier.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { tap } from 'rxjs/operators';
import { ProtectedState } from '../../+store/state';
import { BaseAction, generateActionType } from '../../../+shared/helpers/state.helper';
import { LoggerService } from '../../../+shared/services/logger.service';
import { SUPPLIERS_STATE_FEATURE_NAME } from '../suppliers-state.module';

const type = generateActionType(SUPPLIERS_STATE_FEATURE_NAME, 'Save');

export class SuppliersSaveAction implements BaseAction<ProtectedState> {
  feature = SUPPLIERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: OrganizationSupplier) {}

  handler(state: ProtectedState): ProtectedState {
    return state;
  }
}

@Injectable()
export class SuppliersSaveActionEffect {
  @Effect({ dispatch: false })
  save$ = this.actions$.pipe(
    ofType(type),
    tap(async (action: SuppliersSaveAction) => {
      const { id, ...supplier } = action.payload;
      try {
        await this.db.doc<OrganizationSupplier>(`${CollectionNames.suppliers}/${id}`).update(supplier);
        this.snackBar.open(`Supplier "${supplier.name}" was saved.`, null, {
          duration: 2500,
        });
      } catch (error) {
        this.logger.error(`SuppliersSaveActionEffect.save$ - Error saving supplier "${id}"`, error);
        this.snackBar.open(`Supplier "${supplier.name}" save failed.`, null, {
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
