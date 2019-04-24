import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Invoice } from '@shared/types/invoice.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { of } from 'rxjs/observable/of';
import { catchError, combineLatest as combineLatestOp, filter, map, switchMap } from 'rxjs/operators';
import { ActivePosition } from '../../../+shared/organizationLocationSelector/activePosition.inteface';
import { AppState } from '../../../../+core/store/app.state';
import { getActivePosition } from '../../../../+core/store/selectors';
import {
  firestoreQueryStringStartsWith,
  unwrapCollectionSnapshotChanges,
} from '../../../../+shared/helpers/firestore.helper';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { INVOICES_STATE_FEATURE_NAME } from '../../invoices-state.module';
import { InvoicesState } from '../../invoices.state';
import { getInvoicesListFilter } from '../list.selectors';
import { InvoicesListFilter } from '../listFilter.interface';
import { InvoicesListLoadCollectionFailedAction } from './loadCollectionFailed.action';
import { InvoicesListLoadCollectionSuccessfulAction } from './loadCollectionSuccessful.action';

const type = generateActionType(INVOICES_STATE_FEATURE_NAME, 'List - Load collection');

export class InvoicesListLoadCollectionAction implements BaseAction<InvoicesState> {
  feature = INVOICES_STATE_FEATURE_NAME;
  type = type;

  handler(state: InvoicesState): InvoicesState {
    const list = setStateProperties(state.list, {
      isLoading: true,
      loadError: null,
    });
    return setStateProperties(state, { list });
  }
}

@Injectable()
export class InvoicesListLoadCollectionActionEffect {
  @Effect()
  watchInvoices$ = this.actions$.pipe(
    ofType(type),
    combineLatestOp(
      // watch additional data changes
      this.store.pipe(select(getActivePosition)), // triggers if activeLocationId was changed
      this.store.pipe(select(getInvoicesListFilter)), // triggers if invoicesListFilter was changed
      (action, position, invoicesListFilter) => ({
        position,
        invoicesListFilter,
      }),
    ),
    filter(
      (data: { position: ActivePosition; invoicesListFilter: InvoicesListFilter }) =>
        !!data.position && !!data.position.id,
    ),
    switchMap((data: { position: ActivePosition; invoicesListFilter: InvoicesListFilter }) =>
      this.db
        .collection<Invoice>(`${CollectionNames.invoices}`, ref => {
          let query;
          if (data.position.type === 'location') {
            query = ref.where('locationId', '==', data.position.id);
          } else if (data.position.type === 'organization') {
            query = ref.where('organizationId', '==', data.position.id);
            if (data.invoicesListFilter.locationId) {
              query = query.where('locationId', '==', data.invoicesListFilter.locationId);
            }
          }
          if (data.invoicesListFilter.supplierId) {
            query = query.where('supplierId', '==', data.invoicesListFilter.supplierId);
          }
          if (data.invoicesListFilter.number) {
            const field = 'number';
            query = firestoreQueryStringStartsWith(query, field, data.invoicesListFilter.number).orderBy(field);
          }
          if (data.invoicesListFilter.status) {
            query = query.where('status', '==', data.invoicesListFilter.status);
          }
          query = query.where('isDeleted', '==', !!data.invoicesListFilter.isDeleted);
          query = query.orderBy('createdAt', 'desc');
          return query;
        })
        .snapshotChanges(),
    ),
    map(unwrapCollectionSnapshotChanges),
    map((items: Invoice[]) => new InvoicesListLoadCollectionSuccessfulAction(items)),
    catchError(error => of(new InvoicesListLoadCollectionFailedAction(error))),
    // TODO for Anton: Unsubscribe when user leaves /invoices
  );

  constructor(private actions$: Actions, private store: Store<AppState>, private db: AngularFirestore) {}
}
