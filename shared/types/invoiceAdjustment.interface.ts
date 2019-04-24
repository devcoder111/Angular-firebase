import { InvoiceAdjustmentType } from './invoiceAdjustmentType.interface';

export interface InvoiceAdjustment extends InvoiceAdjustmentType {
  id?: string;
  invoiceId: string;
  invoiceAdjustmentTypeId: string;
  value: number;
  name: string;
  code: string;
  isPositive: boolean;
  isDeleted: boolean;
  sortingNumber: number;
}
