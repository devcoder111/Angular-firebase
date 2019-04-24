export type ProductPriceChangeSourceSlugType = 'invoice' | 'manualChange';

export type ProductPriceChangeSourceType = {
  title: string;
  slug: ProductPriceChangeSourceSlugType;
};

export type ProductPriceChangeSourcesMapType = {
  [key: string]: ProductPriceChangeSourceType;
};

export const ProductPriceChangeSourcesMap: ProductPriceChangeSourcesMapType = {
  invoice: {
    title: 'Invoice',
    slug: 'invoice',
  },
  manualChange: {
    title: 'Manual change',
    slug: 'manualChange',
  },
};
export const ProductPriceChangeSourcesArray: ProductPriceChangeSourceType[] = Object.keys(
  ProductPriceChangeSourcesMap,
).map(key => ProductPriceChangeSourcesMap[key]);
