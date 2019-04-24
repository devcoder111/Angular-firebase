import { Order } from '@shared/types/order.interface';
import { OrderStatuses } from '@shared/values/orderStatuses.array';

export const canOrderBeDeleted = (order: Order): boolean => {
  return order && !order.isDeleted && order.status === OrderStatuses.draft.slug;
};

export const canOrderBeVoided = (order: Order): boolean => {
  return order && !order.isDeleted && [OrderStatuses.sent.slug, OrderStatuses.read.slug].indexOf(order.status) > -1;
};

export const canOrderBeUndeleted = (order: Order): boolean => {
  return order && order.isDeleted;
};
