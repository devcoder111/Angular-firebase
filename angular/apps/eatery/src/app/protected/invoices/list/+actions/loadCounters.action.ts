import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { CounterLocationInvoicesDone } from '@shared/types/counterLocationInvoicesDone.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { combineLatest as combineLatestOp, filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { AppState } from '../../../../+core/store/app.state';
import { getActiveLocationId, getActiveOrganizationId, getActivePosition } from '../../../../+core/store/selectors';
import { unwrapDocSnapshotChanges } from '../../../../+shared/helpers/firestore.helper';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { INVOICES_STATE_FEATURE_NAME } from '../../invoices-state.module';
import { InvoicesState } from '../../invoices.state';
import { InvoicesListLoadLocationCountersSuccessfulAction } from './loadLocationCountersSuccessful.action';
import { CounterOrganizationInvoicesDone } from '@shared/types/counterOrganizationInvoicesDone.interface';
import { InvoicesListLoadOrganizationCountersSuccessfulAction } from './loadOrganizationCountersSuccessful.action';

const type = generateActionType(INVOICES_STATE_FEATURE_NAME, 'List - Load locationCounters');

export class InvoicesListLoadCountersAction implements BaseAction<InvoicesState> {
  feature = INVOICES_STATE_FEATURE_NAME;
  type = type;

  handler(state: InvoicesState): InvoicesState {
    return state;
  }
}

@Injectable()
export class InvoicesListLoadCountersActionEffect {
  @Effect()
  watchLocationInvoices$ = this.actions$.pipe(
    ofType(type),
    combineLatestOp(
      // watch additional data changes
      this.store.pipe(select(getActivePosition)), // triggers if getActivePosition was changed
      (action, position) => ({
        position,
      }),
    ),
    withLatestFrom(this.store, (action, state) => state),
    map(state => getActiveLocationId(state)),
    filter((locationId: string) => !!locationId),
    switchMap((locationId: string) =>
      this.db
        .doc<CounterLocationInvoicesDone>(`${CollectionNames.countersLocationInvoicesDone}/${locationId}`)
        .snapshotChanges(),
    ),
    map(unwrapDocSnapshotChanges),
    map((items: CounterLocationInvoicesDone) => new InvoicesListLoadLocationCountersSuccessfulAction(items)),
  );

  @Effect()
  watchOrganizationInvoices$ = this.actions$.pipe(
    ofType(type),
    combineLatestOp(
      // watch additional data changes
      this.store.pipe(select(getActivePosition)), // triggers if getActivePosition was changed
      (action, position) => ({
        position,
      }),
    ),
    withLatestFrom(this.store, (action, state) => state),
    map(state => getActiveOrganizationId(state)),
    filter((organizationId: string) => !!organizationId),
    switchMap((organizationId: string) =>
      this.db
        .doc<CounterOrganizationInvoicesDone>(`${CollectionNames.countersOrganizationInvoicesDone}/${organizationId}`)
        .snapshotChanges(),
    ),
    map(unwrapDocSnapshotChanges),
    map((items: CounterOrganizationInvoicesDone) => new InvoicesListLoadOrganizationCountersSuccessfulAction(items)),
  );

  constructor(private actions$: Actions, private store: Store<AppState>, private db: AngularFirestore) {}
}
