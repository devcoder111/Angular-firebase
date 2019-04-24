import { HasTaxes } from './hasTaxes.interface';

export interface Invoice extends HasTaxes {
  id?: string;
  number?: string;
  organizationId: string;
  locationId?: string;
  supplierId?: string;
  supplierName?: string;
  invoiceDate?: Date;
  status: string;
  issue?: string;
  isDeleted: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date; // TODO: make mandatory
  updatedById?: string; // TODO: make mandatory
}
