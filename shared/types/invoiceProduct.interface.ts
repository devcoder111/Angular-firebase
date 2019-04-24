import { ProductLine } from './productLine.interface';

export interface InvoiceProduct extends ProductLine {
  id?: string;
  invoiceId: string;
  organizationProductId: string;
  nickname: string;
  name: string;
  code: string;
  image?: string;
  unitTypeId: string;
  unitTypeName: string;
  discount: number;
  organizationId: string;
  locationId: string;
  createdAt: Date;
  createdBy: string;
}
