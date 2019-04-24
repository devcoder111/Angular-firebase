import { OrdersMarkAsDraftActionEffect } from './markAsDraft.action';
import { OrdersRemoveActionEffect } from './remove.action';
import { OrdersVoidActionEffect } from './void.action';

export const OrdersEffects = [OrdersMarkAsDraftActionEffect, OrdersVoidActionEffect, OrdersRemoveActionEffect];
