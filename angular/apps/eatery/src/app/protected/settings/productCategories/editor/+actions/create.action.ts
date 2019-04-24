import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ProductCategory } from '@shared/types/productCategory.interface';
import { AngularFirestore } from 'angularfire2/firestore';
import { map, withLatestFrom } from 'rxjs/operators';
import { AppState } from '../../../../../+core/store/app.state';
import { getActiveOrganizationId } from '../../../../../+core/store/selectors';
import { BaseAction, generateActionType } from '../../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { PRODUCT_CATEGORIES_STATE_FEATURE_NAME } from '../../productCategories-state.module';
import { ProductCategoriesState } from '../../productCategories.state';
import { ProductCategoriesEditorCreateSuccessfulAction } from './createSuccessful.action';

const type = generateActionType(PRODUCT_CATEGORIES_STATE_FEATURE_NAME, 'List - Create');

export class ProductCategoriesEditorCreateAction implements BaseAction<ProductCategoriesState> {
  feature = PRODUCT_CATEGORIES_STATE_FEATURE_NAME;
  type = type;

  handler(state: ProductCategoriesState): ProductCategoriesState {
    const editor = setStateProperties(state.editor, {
      isLoadingProductCategory: true,
      isNew: true,
      productCategory: null,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class ProductCategoriesCreateActionEffect {
  @Effect()
  create$ = this.actions$.pipe(
    ofType(type),
    withLatestFrom(this.store, (action, state) => state),
    map((state: AppState) => {
      const item: ProductCategory = {
        id: this.db.createId(),
        name: null,
        isDeleted: false,
        organizationId: getActiveOrganizationId(state),
        locked: false,
      };
      return new ProductCategoriesEditorCreateSuccessfulAction(item);
    }),
    // no catchError here, because "create" operation is local and sync, so "failed" case is not possible.
  );

  constructor(private actions$: Actions, private db: AngularFirestore, private store: Store<AppState>) {}
}
