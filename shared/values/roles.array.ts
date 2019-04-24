export type RolesSlugType = 'owner' | 'admin' | 'user';

export const Roles: {
  [key: string]: {
    title: string;
    slug: RolesSlugType;
  };
} = {
  owner: {
    title: 'Owner',
    slug: 'owner',
  },
  admin: {
    title: 'Admin',
    slug: 'admin',
  },
  user: {
    title: 'User',
    slug: 'user',
  },
};
export const RolesArray = Object.keys(Roles).map(key => Roles[key]);

export const RoleSlugsArray = Object.keys(Roles).map(key => Roles[key].slug);
