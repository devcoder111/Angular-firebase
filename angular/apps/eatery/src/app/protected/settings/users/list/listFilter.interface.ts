import { RolesSlugType } from '@shared/values/roles.array';

export interface UsersListFilter {
  displayName: string;
  role: RolesSlugType;
}
