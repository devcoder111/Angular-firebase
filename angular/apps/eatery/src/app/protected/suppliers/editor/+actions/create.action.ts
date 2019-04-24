import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { OrganizationSupplier } from '@shared/types/organizationSupplier.interface';
import { AngularFirestore } from 'angularfire2/firestore';
import { map, withLatestFrom } from 'rxjs/operators';
import { AppState } from '../../../../+core/store/app.state';
import { getActiveOrganizationId, getUser } from '../../../../+core/store/selectors';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { SUPPLIERS_STATE_FEATURE_NAME } from '../../suppliers-state.module';
import { SuppliersState } from '../../suppliers.state';
import { SuppliersEditorCreateSuccessfulAction } from './createSuccessful.action';

const type = generateActionType(SUPPLIERS_STATE_FEATURE_NAME, 'Editor - Create');

export class SuppliersEditorCreateAction implements BaseAction<SuppliersState> {
  feature = SUPPLIERS_STATE_FEATURE_NAME;
  type = type;

  handler(state: SuppliersState): SuppliersState {
    const editor = setStateProperties(state.editor, {
      isLoadingSupplier: true,
      isNew: true,
      supplier: null,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class SuppliersEditorCreateActionEffect {
  @Effect()
  create$ = this.actions$.pipe(
    ofType(type),
    withLatestFrom(this.store, (action, state) => state),
    map((state: AppState) => {
      const item: OrganizationSupplier = {
        // BaseSupplier Fields
        id: this.db.createId(),
        name: null,
        businessRegistrationNumber: null,
        address: null,
        isGSTRegistered: false,
        GSTRegistrationNumber: null,
        shouldDisplayPriceInOrder: true,
        deliveryTermsAndConditions: null,
        minimumOrderTotal: 0,
        maximumOrderTotal: 0,
        orderMethods: {},
        ccEmailList: {},
        salesmanName: null,
        salesmanEmail: null,
        salesmanPhoneNumber: null,
        createdAt: new Date(),
        createdBy: getUser(state).id,
        // OrganizationSupplier fields
        baseSupplierId: null,
        organizationId: getActiveOrganizationId(state),
        byLocation: {},
      };
      return new SuppliersEditorCreateSuccessfulAction(item);
    }),
    // no catchError here, because "create" operation is local and sync, so "failed" case is not possible.
  );

  constructor(private actions$: Actions, private db: AngularFirestore, private store: Store<AppState>) {}
}
