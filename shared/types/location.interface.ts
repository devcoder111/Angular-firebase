export interface Location {
  id?: string;
  address: string;
  name: string;
  code: string;
  details: string;
  organizationId: string;
  createdAt: Date;
  createdBy: string;
  isDeleted: boolean;
  availableForUsers: string[];
}
