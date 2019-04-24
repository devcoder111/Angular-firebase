export interface BaseProduct {
  id?: string;
  name: string;
  code: string;
  image?: string;
  supplierId: string;
  supplierName: string;
  createdAt: Date;
  createdBy: string;
}
