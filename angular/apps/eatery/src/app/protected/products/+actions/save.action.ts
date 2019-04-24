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

const type = generateActionType(PRODUCTS_STATE_FEATURE_NAME, 'Save');

export class ProductsSaveAction implements BaseAction<ProtectedState> {
  feature = PRODUCTS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: OrganizationProduct) {}

  handler(state: ProtectedState): ProtectedState {
    return state;
  }
}

@Injectable()
export class ProductsSaveActionEffect {
  @Effect({ dispatch: false })
  save$ = this.actions$.pipe(
    ofType(type),
    tap(async (action: ProductsSaveAction) => {
      const { id, ...product } = action.payload;
      try {
        await this.db.doc<OrganizationProduct>(`${CollectionNames.products}/${id}`).update(product);
        this.snackBar.open(`Product "${product.name}" was saved.`, null, {
          duration: 2500,
        });
      } catch (error) {
        this.logger.error(`ProductsSaveActionEffect.save$ - Error saving product "${id}"`, error);
        this.snackBar.open(`Product "${product.nickname}" save failed.`, null, {
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
