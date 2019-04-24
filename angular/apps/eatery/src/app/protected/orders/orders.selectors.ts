import { createFeatureSelector } from '@ngrx/store';
import { ORDERS_STATE_FEATURE_NAME } from './orders-state.module';
import { OrdersState } from './orders.state';

export const getOrdersState = createFeatureSelector<OrdersState>(ORDERS_STATE_FEATURE_NAME);
