export type SupplierOrderMethodSlugType = 'email' | 'sms' | 'fax';

export type SupplierOrderMethodsItemType = {
  title: string;
  slug: SupplierOrderMethodSlugType;
};

export type SupplierOrderMethodsType = {
  [key: string]: SupplierOrderMethodsItemType;
};

export const SupplierOrderMethods: SupplierOrderMethodsType = {
  email: {
    title: 'Email',
    slug: 'email',
  },
  sms: {
    title: 'SMS',
    slug: 'sms',
  },
  fax: {
    title: 'Fax',
    slug: 'fax',
  },
};
export const SupplierOrderMethodsArray: SupplierOrderMethodsItemType[] = Object.keys(SupplierOrderMethods).map(
  key => SupplierOrderMethods[key],
);
