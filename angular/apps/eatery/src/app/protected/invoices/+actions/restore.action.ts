import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Invoice } from '@shared/types/invoice.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { tap } from 'rxjs/operators';
import { ProtectedState } from '../../+store/state';
import { BaseAction, generateActionType } from '../../../+shared/helpers/state.helper';
import { LoggerService } from '../../../+shared/services/logger.service';
import { INVOICES_STATE_FEATURE_NAME } from '../invoices-state.module';

const type = generateActionType(INVOICES_STATE_FEATURE_NAME, 'Restore');

export class InvoicesRestoreAction implements BaseAction<ProtectedState> {
  feature = INVOICES_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: Invoice) {}

  handler(state: ProtectedState): ProtectedState {
    return state;
  }
}

@Injectable()
export class InvoicesRestoreActionEffect {
  @Effect({ dispatch: false })
  restore$ = this.actions$.pipe(
    ofType(type),
    tap(async (action: InvoicesRestoreAction) => {
      const invoice = action.payload;
      try {
        await this.db.doc<Invoice>(`${CollectionNames.invoices}/${invoice.id}`).update({
          isDeleted: false,
        });
        this.snackBar.open(`Invoice "${invoice.number}" was restored.`, null, {
          duration: 2500,
        });
      } catch (error) {
        this.logger.error(`InvoicesRestoreActionEffect.restore$ - Error restoring invoice "${invoice.number}"`, error);
        this.snackBar.open(`Invoice "${invoice.number}" restoring failed.`, null, { duration: 2500 });
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
