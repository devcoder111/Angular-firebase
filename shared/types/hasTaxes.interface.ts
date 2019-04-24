export interface HasTaxes {
  supplierIsGSTRegistered?: boolean;
  taxes: number;
  subtotal: number;
  total: number;
}
