export interface Organization {
  id?: string;
  name: string;
  details: string;
  createdAt: Date;
  createdBy: string;
  timezone: string;
  isDeleted: boolean;
  ownerId: string;
  admins: string[];
  availableForUsers: string[];
}
