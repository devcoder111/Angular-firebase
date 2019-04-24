import { BaseProduct } from './baseProduct.interface';

export interface OrganizationProduct extends BaseProduct {
  /**
   * "baseProductId" is null when OrganizationProduct was created
   * inside Organization, so there are no BaseProduct for it
   */
  baseProductId: string | null;
  /**
   * Organization's nickname for this product, because product.name is usually not human-friendly
   */
  nickname: string;
  organizationId: string;
  /**
   * "key" is locationId, boolean is "isEnabled" - activation for location
   */
  byLocation: {
    [key: string]: boolean;
  };
  /**
   * It's copy of value of last row in "ProductPriceChanges" collection for this product.
   * This is value before Taxes
   */
  lastPriceFromHistory: number;
  productCategoryId: string;
  /**
   * Percentage amount (ex. 10%), which is used for comparing prev price and next price.
   * If difference is bigger than this value - send notification to the Client
   */
  priceChangeNotificationPercentage: number;
  /**
   * UnitTypeId for Invoice (what client received from supplier - FACT) (ex: "box")
   */
  invoiceUnitTypeId: string;
  invoiceUnitTypeName: string;
  /**
   * UnitTypeId for Order (what client wants to get - PLAN) (ex "kg")
   * Could be null (omitted)
   */
  orderUnitTypeId: string | null;
  orderUnitTypeName: string | null;
  /**
   * Ratio of OrderUnitType to InvoiceUnitType
   * Example 1 box = 10 kg,
   * where "kg" - order unit type
   * and "box" - invoice unit type
   */
  orderUnitTypeRatio: number;
}
