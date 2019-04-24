import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { OrganizationProduct } from '@shared/types/organizationProduct.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { tap } from 'rxjs/operators';
import { ProtectedState } from '../../+store/state';
import { BaseAction, generateActionType } from '../../../+shared/helpers/state.helper';
import { LoggerService } from '../../../+shared/services/logger.service';
import { PRODUCTS_STATE_FEATURE_NAME } from '../products-state.module';

const type = generateActionType(PRODUCTS_STATE_FEATURE_NAME, 'Change Category');

export class ProductsChangeCategoryAction implements BaseAction<ProtectedState> {
  feature = PRODUCTS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: { product: OrganizationProduct; categoryId: string }) {}

  handler(state: ProtectedState): ProtectedState {
    return state;
  }
}

@Injectable()
export class ProductsChangeCategoryActionEffect {
  @Effect({ dispatch: false })
  changeCategory$ = this.actions$.pipe(
    ofType(type),
    tap(async (action: ProductsChangeCategoryAction) => {
      const product = action.payload.product;
      const categoryId = action.payload.categoryId;
      try {
        await this.db.doc<OrganizationProduct>(`${CollectionNames.products}/${product.id}`).update({
          productCategoryId: categoryId,
        });
        this.snackBar.open(`Category of "${product.name}" changed.`, null, {
          duration: 2500,
        });
      } catch (error) {
        this.logger.error(
          `ProductsChangeCategoryEffect.changeCategory$ - Error changing category of product "${product.name}":`,
          error,
        );
        this.snackBar.open(`Product "${product.name}" changing category failed.`, null, { duration: 2500 });
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
