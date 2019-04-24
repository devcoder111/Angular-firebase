import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { OrganizationSupplier } from '@shared/types/organizationSupplier.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AppState } from '../../../../+core/store/app.state';
import { unwrapDocSnapshotChanges } from '../../../../+shared/helpers/firestore.helper';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { SUPPLIERS_STATE_FEATURE_NAME } from '../../suppliers-state.module';
import { SuppliersState } from '../../suppliers.state';
import { SuppliersEditorLoadSupplierFailedAction } from './loadFailed.action';
import { SuppliersEditorLoadSuccessfulAction } from './loadSuccessful.action';
import { SuppliersEditorUpdateAction } from './update.action';

const type = generateActionType(SUPPLIERS_STATE_FEATURE_NAME, 'Editor - Load');

export class SuppliersEditorItemLoadAction implements BaseAction<SuppliersState> {
  feature = SUPPLIERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: string) {}

  handler(state: SuppliersState): SuppliersState {
    const editor = setStateProperties(state.editor, {
      isLoadingSupplier: true,
      supplier: null,
      loadSupplierError: null,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class SuppliersEditorLoadActionEffect {
  @Effect()
  watchItem$ = this.actions$.pipe(
    ofType(type),
    switchMap((action: SuppliersEditorItemLoadAction) =>
      this.db
        .doc<OrganizationSupplier>(`${CollectionNames.suppliers}/${action.payload}`)
        .snapshotChanges()
        .pipe(
          map(unwrapDocSnapshotChanges),
          map(
            (item: OrganizationSupplier, indexOfEvent: number) =>
              indexOfEvent === 0 // if first time
                ? new SuppliersEditorLoadSuccessfulAction(item)
                : new SuppliersEditorUpdateAction(item),
          ),
          catchError(error => of(new SuppliersEditorLoadSupplierFailedAction(error))),
          // TODO for Anton: Unsubscribe when user leaves /suppliers/:id
        ),
    ),
  );

  constructor(private actions$: Actions, private store: Store<AppState>, private db: AngularFirestore) {}
}
