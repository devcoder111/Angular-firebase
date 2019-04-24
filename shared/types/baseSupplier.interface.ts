export interface BaseSupplier {
  id?: string;
  name: string;
  businessRegistrationNumber: string;
  address: string;
  isGSTRegistered: boolean;
  GSTRegistrationNumber: string;
  shouldDisplayPriceInOrder: boolean;
  deliveryTermsAndConditions: string;
  minimumOrderTotal: number;
  maximumOrderTotal: number;
  orderMethods: {
    [orderMethodType: string]: {
      // "orderMethodType" is really of type SupplierOrderMethodSlugType, but TypeScript doesn't support that
      value: string;
      sortingNumber: number;
    };
  };
  ccEmailList: {
    [email: string]: number; // {email: sortingNumber}
  };
  salesmanName: string;
  salesmanEmail: string;
  salesmanPhoneNumber: string;
  createdAt: Date;
  createdBy: string;
  // TODO: countries support
}
