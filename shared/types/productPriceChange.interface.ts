import { ProductPriceChangeSourceSlugType } from '../values/productPriceChangeSourceType.array';

/**
 * Row in Price history
 */
export interface ProductPriceChange {
  id?: string;
  productId: string;
  baseProductId: string;
  supplierId: string;
  supplierName: string;
  organizationId: string;
  locationId: string;
  /**
   * What is new price for the product
   */
  price: number;
  /**
   * How many units was received
   */
  amount: number;
  differenceWithPrevPrice: number;
  differenceInPercentsWithPrevPrice: number;
  /**
   * How many $ in total (price * amount)
   */
  total: number;
  invoiceUnitTypeId: string;
  invoiceUnitTypeName: string;
  /**
   * Where did the change come from
   */
  sourceType: ProductPriceChangeSourceSlugType;
  /**
   * if sourceType === 'invoice' then sourceId is invoice.id
   * if sourceType === 'manualChange' then sourceId is user.id,
   * where user is a Client
   */
  sourceId: string;
  createdAt: Date;
  /**
   * if sourceType === 'invoice' then createdBy is user.id,
   * where user is a member of Clearing team, who worked on the invoice
   * if sourceType === 'manualChange' then sourceId is user.id,
   * where user is a Client
   */
  createdBy: string;
}
