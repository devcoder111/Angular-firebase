import { ProductCategory } from '@shared/types/productCategory.interface';

export const canProductCategoryBeDeleted = (productCategory: ProductCategory): boolean => {
  return !!productCategory && !productCategory.isDeleted;
};

export const canProductCategoryBeRestored = (productCategory: ProductCategory): boolean => {
  return !!productCategory && productCategory.isDeleted;
};

export const isProductCategoryLocked = (productCategory: ProductCategory): boolean => {
  return !!productCategory && productCategory.locked;
};
