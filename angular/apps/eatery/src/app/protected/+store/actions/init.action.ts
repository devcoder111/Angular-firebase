import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { ProductCategory } from '@shared/types/productCategory.interface';
import { UnitType } from '@shared/types/unitType.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { of } from 'rxjs/observable/of';
import { catchError, combineLatest as combineLatestOp, map, switchMap } from 'rxjs/operators';
import { AppState } from '../../../+core/store/app.state';
import { getActiveOrganizationId } from '../../../+core/store/selectors';
import { unwrapCollectionSnapshotChanges } from '../../../+shared/helpers/firestore.helper';
import { BaseAction, generateActionType } from '../../../+shared/helpers/state.helper';
import { LoggerService } from '../../../+shared/services/logger.service';
import { FEATURE_NAME } from '../module';
import { ProtectedState } from '../state';
import { ProductCategoriesLoadCollectionErrorAction } from './productCategoriesLoadCollectionFailed.action';
import { ProductCategoriesSetCollectionAction } from './productCategoriesSetCollection.action';
import { UnitTypesLoadCollectionErrorAction } from './unitTypesLoadCollectionFailed.action';
import { UnitTypesSetCollectionAction } from './unitTypesSetCollection.action';

const type = generateActionType(FEATURE_NAME, 'Init');

export class ProtectedInitAction implements BaseAction<ProtectedState> {
  feature = FEATURE_NAME;
  type = type;

  handler(state: ProtectedState): ProtectedState {
    return state;
  }
}

@Injectable()
export class ProtectedInitActionEffect {
  @Effect()
  watchUnitTypes$ = this.actions$.pipe(
    ofType(type),
    switchMap(() =>
      this.db
        .collection<UnitType>(`${CollectionNames.unitTypes}`, ref => ref.orderBy('name', 'asc'))
        .snapshotChanges()
        .pipe(map(unwrapCollectionSnapshotChanges)),
    ),
    map((items: UnitType[]) => new UnitTypesSetCollectionAction(items)),
    catchError(error => {
      this.logger.error('ProtectedInitActionEffect.watchUnitTypes$: ', error);
      return of(new UnitTypesLoadCollectionErrorAction(error));
    }),
  );

  @Effect()
  watchProductCategories$ = this.actions$.pipe(
    ofType(type),
    combineLatestOp(
      this.store.pipe(select(getActiveOrganizationId)),
      (action, activeOrganizationId) => activeOrganizationId,
    ),
    switchMap((activeOrganizationId: string) =>
      this.db
        .collection<ProductCategory>(`${CollectionNames.productCategories}`, ref =>
          ref
            .where('organizationId', '==', activeOrganizationId)
            .where('isDeleted', '==', false)
            .orderBy('name', 'asc'),
        )
        .snapshotChanges()
        .pipe(map(unwrapCollectionSnapshotChanges)),
    ),
    map((items: ProductCategory[]) => new ProductCategoriesSetCollectionAction(items)),
    catchError(error => {
      this.logger.error('OrganizationsLoadDataForActiveOneActionEffect.watchProductCategories$: ', error);
      return of(new ProductCategoriesLoadCollectionErrorAction(error));
    }),
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private db: AngularFirestore,
    private logger: LoggerService,
  ) {}
}
