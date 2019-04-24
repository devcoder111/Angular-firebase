export type OrderStatusSlugType =
  | 'draft'
  | 'toApprove'
  | 'sent'
  | 'read'
  | 'notSent'
  | 'rejected'
  | 'voided'
  | 'delivered';

export type OrderStatusType = {
  title: string;
  slug: OrderStatusSlugType;
};

export const OrderStatuses = {
  draft: {
    title: 'Draft',
    slug: 'draft' as OrderStatusSlugType,
  },
  toApprove: {
    title: 'To Approve',
    slug: 'toApprove' as OrderStatusSlugType,
  },
  sent: {
    title: 'Sent',
    slug: 'sent' as OrderStatusSlugType,
  },
  read: {
    title: 'Read',
    slug: 'read' as OrderStatusSlugType,
  },
  notSent: {
    title: 'Not sent',
    slug: 'notSent' as OrderStatusSlugType,
  },
  rejected: {
    title: 'Rejected',
    slug: 'rejected' as OrderStatusSlugType,
  },
  voided: {
    title: 'Voided',
    slug: 'voided' as OrderStatusSlugType,
  },
  delivered: {
    title: 'Delivered',
    slug: 'delivered' as OrderStatusSlugType,
  },
};
export const OrderStatusesArray: OrderStatusType[] = Object.keys(OrderStatuses).map(slug => OrderStatuses[slug]);
