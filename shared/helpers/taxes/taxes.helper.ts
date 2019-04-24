import { HasTaxes } from '../../types/hasTaxes.interface';
import { InvoiceAdjustment } from '../../types/invoiceAdjustment.interface';
import { ProductLine } from '../../types/productLine.interface';
import { setStateProperties } from '../state/state.helper';

/**
 * Calculate `total` for `OrderProduct` or `Invoice Product`. (`discount` field exists in `InvoiceProduct`, but
 * doesn't exist in `OrderProduct`)
 * @param product `OrderProduct` or `InvoiceProduct` object to calculate
 */
export function calcLineTotal<T extends ProductLine>(product: T): T {
  if (product.price === undefined) {
    throw new Error('Price is not defined');
  }
  if (product.price < 0) {
    throw new Error('Price must be not less than zero');
  }
  if (product.quantity === undefined) {
    throw new Error('Quantity is not defined');
  }
  if (product.quantity <= 0) {
    throw new Error('Quantity must be greater than zero');
  }
  if (product.discount && !(product.discount >= 0 && product.discount <= 100)) {
    throw new Error('discount should be in the range from 0 to 100');
  }
  let percentWithoutDiscount = product.discount ? 1 - product.discount / 100 : 1;
  const total = Math.round(product.price * product.quantity * percentWithoutDiscount);
  return setStateProperties(product, { total } as T);
}

/**
 * Calculate `taxes`,`subtotal` and `total` for `Order` or `Invoice`
 * @param doc `Order` or `Invoice` object to calculate. `doc` also contains `supplierIsGSTRegistered` field, if
 * `supplierIsGSTRegistered` == false than taxes will be zero and subtotal equals total.
 * @param products array of `ProductLine`. ProductLine contains `total` field and counted only if `isDeleted` == false
 * @param adjustments array of InvoiceAdjustment (exists only for `Invoice`). InvoiceAdjustment may positive or
 * negative (`isPositive` field) and counted only if `isDeleted` == false
 */
export function calcDocTotals<T extends HasTaxes>(
  doc: T,
  products: ProductLine[],
  adjustments?: InvoiceAdjustment[],
): T {
  if (!(products && products.length)) {
    return doc;
  }
  if (products.find(product => product.total === undefined || product.total === null)) {
    throw new Error('There is product with undefined `total` field');
  }
  if (products.find(product => product.total < 0)) {
    throw new Error('There is product where `total` is less than zero');
  }
  if (products.find(product => product.isDeleted === undefined || product.isDeleted === null)) {
    throw new Error('There is product with undefined `isDeleted` field');
  }
  if (adjustments && adjustments.find(adjustment => adjustment.value === undefined || adjustment.value === null)) {
    throw new Error('There is product with undefined `value` field');
  }
  if (
    adjustments &&
    adjustments.find(adjustment => adjustment.isPositive === undefined || adjustment.isPositive === null)
  ) {
    throw new Error('There is adjustments with undefined `isPositive` field');
  }
  if (
    adjustments &&
    adjustments.find(adjustment => adjustment.isDeleted === undefined || adjustment.isDeleted === null)
  ) {
    throw new Error('There is adjustments with undefined `isDeleted` field');
  }

  let subtotal = products.reduce((acc, cur) => acc + (cur.isDeleted ? 0 : cur.total), 0);
  if (adjustments && adjustments.length) {
    subtotal += adjustments.reduce((a, c) => a + (c.isDeleted ? 0 : c.isPositive ? c.value : -c.value), 0);
  }
  const taxes = Math.round(subtotal * (doc.supplierIsGSTRegistered ? 0.07 : 0));
  const total = subtotal + taxes;
  return setStateProperties(doc, { taxes, subtotal, total } as T);
}
