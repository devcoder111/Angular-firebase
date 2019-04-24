import { OrderStatusSlugType } from '../values/orderStatuses.array';
import { HasTaxes } from './hasTaxes.interface';

export interface Order extends HasTaxes {
  id?: string;
  number: string;
  organizationId: string;
  locationId: string;
  supplierId: string;
  supplierName: string;
  supplierIsGSTRegistered: boolean;
  otherInstructions: string;
  deliveryDate: Date;
  status: OrderStatusSlugType;
  isDeleted: boolean;
  publicPage: {
    openedAt: Date | null;
    html: {
      url: string | null;
      fileId: string | null;
    };
    pdf: {
      url: string | null;
      fileId: string | null;
    };
  };
  voidReason: string | null;
  recentOrderNumber: string | null;
  recentOrderId: string | null;
  createdAt: Date;
  createdBy: string;
}
