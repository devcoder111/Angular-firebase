import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Invoice } from '@shared/types/invoice.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { timer } from 'rxjs/observable/timer';
import { tap } from 'rxjs/operators';
import { ProtectedState } from '../../+store/state';
import { BaseAction, generateActionType } from '../../../+shared/helpers/state.helper';
import { LoggerService } from '../../../+shared/services/logger.service';
import { INVOICES_STATE_FEATURE_NAME } from '../invoices-state.module';

const type = generateActionType(INVOICES_STATE_FEATURE_NAME, 'Remove');

export class InvoicesRemoveAction implements BaseAction<ProtectedState> {
  feature = INVOICES_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: Invoice) {}

  handler(state: ProtectedState): ProtectedState {
    return state;
  }
}

@Injectable()
export class InvoicesRemoveActionEffect {
  @Effect({ dispatch: false })
  delete$ = this.actions$.pipe(
    ofType(type),
    tap((action: InvoicesRemoveAction) => {
      const invoice = action.payload;
      const snackBarRef = this.snackBar.open(
        `Invoice ${invoice.number || invoice.id} will be deleted in a moment`,
        'CANCEL',
        { duration: 3500 },
      );

      const deleteSub = timer(3500).subscribe(() =>
        this.db
          .doc<Invoice>(`${CollectionNames.invoices}/${invoice.id}`)
          .update({ isDeleted: true })
          .catch(error => {
            this.logger.error('InvoicesRemoveActionEffect.delete$', error);
            this.snackBar.open(`Invoice wasn't deleted on the server. Error`, null, { duration: 2500 });
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
