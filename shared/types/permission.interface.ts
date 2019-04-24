import { RolesSlugType } from '../values/roles.array';

export interface Permission {
  id?: string; // "<userId>_<organizationId>"
  userId: string;
  displayName?: string; // cache field from User
  email: string; // cache field from User
  jobTitle?: string; // cache field from User
  phone?: string; // cache field from User
  organizationId: string;
  role: RolesSlugType;
  byLocations: string[];
  invitedAt: Date;
  invitedBy: string;
  confirmedAt?: Date;
}
