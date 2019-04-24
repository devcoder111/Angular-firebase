import { createFeatureSelector } from '@ngrx/store';
import { PRODUCT_CATEGORIES_STATE_FEATURE_NAME } from './productCategories-state.module';
import { ProductCategoriesState } from './productCategories.state';

export const getProductCategoriesState = createFeatureSelector<ProductCategoriesState>(
  PRODUCT_CATEGORIES_STATE_FEATURE_NAME,
);
