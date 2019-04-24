import { BaseSupplier } from './baseSupplier.interface';

export interface OrganizationSupplier extends BaseSupplier {
  /*
  * "baseSupplierId" is null when OrganizationSupplier was created
  * inside Organization, so there are no BaseSupplier for it
  * */
  baseSupplierId: string | null;
  organizationId: string;
  byLocation: {
    [key: string]: boolean; // "key" is locationId, boolean is "isEnabled"
  };
}
