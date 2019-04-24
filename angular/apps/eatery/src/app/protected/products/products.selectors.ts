import { createFeatureSelector } from '@ngrx/store';
import { PRODUCTS_STATE_FEATURE_NAME } from './products-state.module';
import { ProductsState } from './products.state';

export const getProductsState = createFeatureSelector<ProductsState>(PRODUCTS_STATE_FEATURE_NAME);
