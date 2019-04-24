import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { tap } from 'rxjs/operators';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { INVOICES_STATE_FEATURE_NAME } from '../../invoices-state.module';
import { InvoicesState } from '../../invoices.state';
import { File } from '@shared/types/file.interface';
import { timer } from '../../../../../../../../node_modules/rxjs/observable/timer';
import { Order } from '@shared/types/order.interface';
import { MatSnackBar } from '@angular/material';
import { LoggerService } from '../../../../+shared/services/logger.service';

const type = generateActionType(INVOICES_STATE_FEATURE_NAME, 'Editor - Delete image');

export class DeleteImageAction implements BaseAction<InvoicesState> {
  feature = INVOICES_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: File) {}

  handler(state: InvoicesState, action: this): InvoicesState {
    const editor = setStateProperties(state.editor, {});
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class DeleteImageActionEffect {
  @Effect({ dispatch: false })
  delete$ = this.actions$.ofType(type).pipe(
    tap((action: DeleteImageAction) => {
      const image = action.payload;
      const snackBarRef = this.snackBar.open(`Image will be deleted in a moment`, 'CANCEL', { duration: 3500 });

      const deleteSub = timer(3500).subscribe(() =>
        this.db
          .doc<Order>(`${CollectionNames.files}/${image.id}`)
          .delete()
          .catch(error => {
            this.logger.error('DeleteImageActionEffect.delete$', error);
            this.snackBar.open(`Image wasn't deleted on the server. Error`, null, { duration: 2500 });
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
