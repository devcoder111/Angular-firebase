import { ProductLine } from './productLine.interface';

export interface OrderProduct extends ProductLine {
  id?: string;
  orderId: string;
  name: string;
  subtotal: number;
  organizationProductId: string;
  nickname: string;
  code: string;
  organizationId: string;
  locationId: string;
  createdAt: Date;
  createdBy: string;
  image?: string;
  unitTypeId: string;
  unitTypeName: string;
}
