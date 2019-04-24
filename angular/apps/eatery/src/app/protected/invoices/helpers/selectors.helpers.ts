import { Invoice } from '@shared/types/invoice.interface';

export const canInvoiceBeDeleted = (invoice: Invoice): boolean => {
  return invoice && !invoice.isDeleted;
};

export const canInvoiceBeUndeleted = (invoice: Invoice): boolean => {
  return invoice && invoice.isDeleted;
};
