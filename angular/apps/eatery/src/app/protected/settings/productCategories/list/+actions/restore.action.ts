import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ProductCategory } from '@shared/types/productCategory.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { tap } from 'rxjs/operators';
import { ProtectedState } from '../../../../+store/state';
import { BaseAction, generateActionType } from '../../../../../+shared/helpers/state.helper';
import { LoggerService } from '../../../../../+shared/services/logger.service';
import { PRODUCT_CATEGORIES_STATE_FEATURE_NAME } from '../../productCategories-state.module';

const type = generateActionType(PRODUCT_CATEGORIES_STATE_FEATURE_NAME, 'Restore');

export class ProductCategoriesRestoreAction implements BaseAction<ProtectedState> {
  feature = PRODUCT_CATEGORIES_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: ProductCategory) {}

  handler(state: ProtectedState): ProtectedState {
    return state;
  }
}

@Injectable()
export class ProductCategoriesRestoreActionEffect {
  @Effect({ dispatch: false })
  markAsDraft$ = this.actions$.pipe(
    ofType(type),
    tap(async (action: ProductCategoriesRestoreAction) => {
      const productCategory = action.payload;
      try {
        await this.db.doc<ProductCategory>(`${CollectionNames.productCategories}/${productCategory.id}`).update({
          isDeleted: false,
        });
        this.snackBar.open(`Product category "${productCategory.name}" was restored.`, null, {
          duration: 2500,
        });
      } catch (error) {
        this.logger.error(
          `ProductCategoriesRestoreActionEffect.markAsDraft$ - Error restoring product category "${productCategory.name ||
            productCategory.id}":`,
          error,
        );
        this.snackBar.open(`Product category "${productCategory.name}"restore failed.`, null, {
          duration: 2500,
        });
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
