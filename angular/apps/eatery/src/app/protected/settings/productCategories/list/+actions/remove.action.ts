import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ProductCategory } from '@shared/types/productCategory.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { timer } from 'rxjs/observable/timer';
import { tap } from 'rxjs/operators';
import { ProtectedState } from '../../../../+store/state';
import { BaseAction, generateActionType } from '../../../../../+shared/helpers/state.helper';
import { LoggerService } from '../../../../../+shared/services/logger.service';
import { PRODUCT_CATEGORIES_STATE_FEATURE_NAME } from '../../productCategories-state.module';

const type = generateActionType(PRODUCT_CATEGORIES_STATE_FEATURE_NAME, 'Remove');

export class ProductCategoriesRemoveAction implements BaseAction<ProtectedState> {
  feature = PRODUCT_CATEGORIES_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: ProductCategory) {}

  handler(state: ProtectedState): ProtectedState {
    return state;
  }
}

@Injectable()
export class ProductCategoriesRemoveActionEffect {
  @Effect({ dispatch: false })
  delete$ = this.actions$.pipe(
    ofType(type),
    tap((action: ProductCategoriesRemoveAction) => {
      const productCategory = action.payload;
      const snackBarRef = this.snackBar.open(
        `Product category "${productCategory.name || productCategory.id}" will be deleted in a moment`,
        'CANCEL',
        { duration: 3500 },
      );

      const deleteSub = timer(3500).subscribe(() =>
        this.db
          .doc<ProductCategory>(`${CollectionNames.productCategories}/${productCategory.id}`)
          .update({ isDeleted: true })
          .catch(error => {
            this.logger.error('ProductCategoriesRemoveActionEffect.delete$ - Error deleting product category', error);
            this.snackBar.open(`Product category wasn't deleted on the server. Error`, null, { duration: 2500 });
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
