import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { OrganizationSupplier } from '@shared/types/organizationSupplier.interface';

import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap } from 'rxjs/operators';
import { unwrapDocSnapshotChanges } from '../../../../+shared/helpers/firestore.helper';
import { generateActionType } from '../../../../+shared/helpers/state.helper';
import { ORDERS_STATE_FEATURE_NAME } from '../../orders-state.module';
import { OrdersEditorLoadSupplierFailedAction } from './loadSupplierFailed.action';
import { OrdersEditorLoadSupplierSuccessfulAction } from './loadSupplierSuccessful.action';

const type = generateActionType(ORDERS_STATE_FEATURE_NAME, 'Editor - Supplier load');

export class OrdersEditorSupplierLoadAction {
  feature = ORDERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: string) {} //supplierId
}

@Injectable()
export class OrdersEditorSupplierLoadActionEffect {
  @Effect()
  watchItem$ = this.actions$.pipe(
    ofType(type),
    switchMap((action: OrdersEditorSupplierLoadAction) =>
      this.db
        .doc<OrganizationSupplier>(`${CollectionNames.suppliers}/${action.payload}`)
        .snapshotChanges()
        .pipe(
          map(unwrapDocSnapshotChanges),
          map((item: OrganizationSupplier) => new OrdersEditorLoadSupplierSuccessfulAction(item)),
          catchError(error => of(new OrdersEditorLoadSupplierFailedAction(error))),
        ),
    ),
  );

  constructor(private actions$: Actions, private db: AngularFirestore) {}
}
