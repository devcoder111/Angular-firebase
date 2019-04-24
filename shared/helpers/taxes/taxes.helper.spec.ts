import { Invoice } from '../../types/invoice.interface';
import { InvoiceAdjustment } from '../../types/invoiceAdjustment.interface';
import { InvoiceProduct } from '../../types/invoiceProduct.interface';
import { Order } from '../../types/order.interface';
import { OrderProduct } from '../../types/orderProduct.interface';
import { omit } from '../omit/omit.helper';
import { setStateProperties } from '../state/state.helper';
import { calcDocTotals, calcLineTotal } from './taxes.helper';

const orderEtalon: Order = {
  number: 'fakeName',
  organizationId: 'fakeId',
  locationId: 'fakeId',
  supplierId: 'fakeId',
  supplierName: 'fakeName',
  otherInstructions: 'fakeString',
  deliveryDate: new Date(),
  status: 'draft',
  isDeleted: false,
  publicPage: {
    openedAt: new Date(),
    html: {
      url: 'fakeString',
      fileId: 'fakeId',
    },
    pdf: {
      url: 'fakeString',
      fileId: 'fakeId',
    },
  },
  voidReason: 'fakeString',
  recentOrderNumber: 'fakeString',
  recentOrderId: 'fakeString',
  createdAt: new Date(),
  createdBy: 'fakeId',
  supplierIsGSTRegistered: true,
  taxes: 0,
  subtotal: 0,
  total: 0,
};

const orderProductEtalon: OrderProduct = {
  orderId: 'fakeId',
  name: 'fakeName',
  subtotal: 1, //TODO
  organizationProductId: 'fakeId',
  nickname: 'fakeName',
  code: 'fakeName',
  organizationId: 'fakeId',
  locationId: 'fakeId',
  createdAt: new Date(),
  createdBy: 'fakeId',
  unitTypeId: 'fakeId',
  unitTypeName: 'fakeName',
  price: 10000,
  quantity: 2,
  total: 20000,
  isDeleted: false,
} as OrderProduct;

const orderProductsEtalon: OrderProduct[] = [orderProductEtalon, orderProductEtalon];

const invoiceEtalon: Invoice = {
  organizationId: 'fakeId',
  status: 'fakeName',
  isDeleted: false,
  createdAt: new Date(),
  createdBy: 'fakeId',
  supplierIsGSTRegistered: true,
  taxes: 0,
  subtotal: 0,
  total: 0,
} as Invoice;

const invoiceProductEtalon: InvoiceProduct = {
  invoiceId: 'fakeId',
  organizationProductId: 'fakeId',
  nickname: 'fakeName',
  name: 'fakeName',
  code: 'fakeName',
  unitTypeId: 'fakeId',
  unitTypeName: 'fakeName',
  organizationId: 'fakeId',
  locationId: 'fakeId',
  createdAt: new Date(),
  createdBy: 'fakeId',
  price: 10000,
  quantity: 2,
  discount: 0,
  total: 20000,
  isDeleted: false,
} as InvoiceProduct;

const invoiceProductsEtalon: InvoiceProduct[] = [invoiceProductEtalon, invoiceProductEtalon];

const invoiceAdjustmentEtalon: InvoiceAdjustment = {
  invoiceId: 'fakeName',
  invoiceAdjustmentTypeId: 'fakeName',
  value: 10000,
  name: 'fakeName',
  code: 'fakeName',
  isPositive: true,
  isDeleted: false,
  sortingNumber: 1,
};

const invoiceAdjustmentsEtalon: InvoiceAdjustment[] = [invoiceAdjustmentEtalon, invoiceAdjustmentEtalon];

describe('helpers', () => {
  describe('taxes', () => {
    describe('calcLineTotal', () => {
      describe('orderProduct', () => {
        it('must throws exception if `price` field is not defined', () => {
          expect(() => {
            calcLineTotal(omit(orderProductEtalon, ['price']));
          }).toThrow('Price is not defined');
        });

        it('must throws exception if `price` field is not defined', () => {
          expect(() => {
            calcLineTotal(setStateProperties(orderProductEtalon, { price: -1 }));
          }).toThrow('Price must be not less than zero');
        });

        it('must throws exception if `quantity` field is not defined', () => {
          expect(() => {
            calcLineTotal(omit(orderProductEtalon, ['quantity']));
          }).toThrow('Quantity is not defined');
        });

        it('must throws exception if `quantity` field is not defined', () => {
          expect(() => {
            calcLineTotal(setStateProperties(orderProductEtalon, { quantity: -1 }));
          }).toThrow('Quantity must be greater than zero');
          expect(() => {
            calcLineTotal(setStateProperties(orderProductEtalon, { quantity: 0 }));
          }).toThrow('Quantity must be greater than zero');
        });

        it('orderProduct.total must calculate total', () => {
          const orderProductResult = calcLineTotal(orderProductEtalon);
          expect(orderProductResult.total).toBe(20000);
        });

        it('orderProduct.total must calculate total if there is product with zero `price`', () => {
          const orderProductResult = calcLineTotal(setStateProperties(orderProductEtalon, { price: 0 }));
          expect(orderProductResult.total).toBe(0);
        });

        it('method must not change fields except `total`', () => {
          const orderProductResult = calcLineTotal(orderProductEtalon);
          expect(omit(orderProductResult, ['total'])).toEqual(omit(orderProductEtalon, ['total']));
        });
      });

      describe('invoiceProduct', () => {
        it('must throws exception if `discount` field is not empty and value is not in from 0 to 100', () => {
          expect(() => {
            calcLineTotal(setStateProperties(invoiceProductEtalon, { discount: -1 }));
          }).toThrow('discount should be in the range from 0 to 100');
          expect(() => {
            calcLineTotal(setStateProperties(invoiceProductEtalon, { discount: 101 }));
          }).toThrow('discount should be in the range from 0 to 100');
        });

        it('invoiceProductEtalon.total must be calculated total with discount', () => {
          const invoiceProductResult = calcLineTotal(setStateProperties(invoiceProductEtalon, { discount: 10 }));
          expect(invoiceProductResult.total).toBe(18000);
        });

        it('invoiceProductEtalon.total must be 0 if discount 100', () => {
          const invoiceProduct = setStateProperties(invoiceProductEtalon, { discount: 100 });
          const invoiceProductResult = calcLineTotal(invoiceProduct);
          expect(invoiceProductResult.total).toBe(0);
        });

        it('invoiceProductEtalon.total must be rounded to 4 numbers after point', () => {
          const invoiceProduct = setStateProperties(invoiceProductEtalon, { price: 1, quantity: 1, discount: 51 });
          const invoiceProductResult = calcLineTotal(invoiceProduct);
          expect(invoiceProductResult.total).toBe(0);
        });
      });
    });

    describe('calcDocTotals', () => {
      describe('order', () => {
        it('must throws exception if any of product has undefined `total` field', () => {
          expect(() => {
            calcDocTotals(orderEtalon, [orderProductsEtalon[0], omit(orderProductsEtalon[1], ['total'])]);
          }).toThrow('There is product with undefined `total` field');
        });

        it('must throws exception if any of product has `total` that not greater than zero', () => {
          expect(() => {
            calcDocTotals(orderEtalon, [
              orderProductsEtalon[0],
              setStateProperties(orderProductsEtalon[1], { total: -1 }),
            ]);
          }).toThrow('There is product where `total` is less than zero');
        });

        it('must throws exception if any of product has undefined `isDeleted` field', () => {
          expect(() => {
            calcDocTotals(orderEtalon, [orderProductsEtalon[0], omit(orderProductsEtalon[1], ['isDeleted'])]);
          }).toThrow('There is product with undefined `isDeleted` field');
        });

        it('must return original order/invoice if `products` are not defined or empty', () => {
          const orderResult = calcDocTotals(orderEtalon, null);
          expect(orderResult).toBe(orderEtalon);
        });

        it('`subtotal` must be calculated', () => {
          const orderResult = calcDocTotals(orderEtalon, orderProductsEtalon);
          expect(orderResult.subtotal).toBe(40000);
        });

        it('`subtotal` must be calculated if there is product with zero `total`', () => {
          const orderResult = calcDocTotals(orderEtalon, [
            orderProductsEtalon[0],
            setStateProperties(orderProductsEtalon[1], { total: 0 }),
          ]);
          expect(orderResult.subtotal).toBe(20000);
        });

        it('`subtotal` must be calculated with respect to `isDeleted` field of `products`', () => {
          const orderResult = calcDocTotals(orderEtalon, [
            orderProductsEtalon[0],
            setStateProperties(orderProductsEtalon[1], { isDeleted: true }),
          ]);
          expect(orderResult.subtotal).toBe(20000);
        });

        it('`taxes` must be 0 if doc.supplierIsGSTRegistered is undefined or false', () => {
          const orderWithoutSupplierIsGSTRegisteredResult = calcDocTotals(
            omit(orderEtalon, ['supplierIsGSTRegistered']),
            orderProductsEtalon,
          );
          expect(orderWithoutSupplierIsGSTRegisteredResult.taxes).toBe(0);
          const orderWithZeroSupplierIsGSTRegisteredResult = calcDocTotals(
            setStateProperties(orderEtalon, { supplierIsGSTRegistered: false }),
            orderProductsEtalon,
          );
          expect(orderWithZeroSupplierIsGSTRegisteredResult.taxes).toBe(0);
        });

        it('`taxes` must be 7% if doc.supplierIsGSTRegistered is true', () => {
          const orderResult = calcDocTotals(orderEtalon, orderProductsEtalon);
          expect(orderResult.taxes).toBe(2800);
        });

        it('`taxes` must be rounded to 4 numbers after point', () => {
          const orderResult = calcDocTotals(orderEtalon, [
            setStateProperties(orderProductsEtalon[0], { total: 0.0007 }),
          ]);
          expect(orderResult.taxes).toBe(0);
        });

        it('`total` must be calculated', () => {
          const orderResult = calcDocTotals(orderEtalon, orderProductsEtalon);
          expect(orderResult.total).toBe(42800);
        });

        it('method must not change fields except `subtotal`,`taxes` and `total`', () => {
          const orderResult = calcDocTotals(orderEtalon, orderProductsEtalon);
          expect(omit(orderResult, ['subtotal', 'taxes', 'total'])).toEqual(
            omit(orderEtalon, ['subtotal', 'taxes', 'total']),
          );
        });
      });

      describe('invoice', () => {
        it('must throws exception if any of invoiceAdjustments has undefined `value` field', () => {
          expect(() => {
            calcDocTotals(invoiceEtalon, invoiceProductsEtalon, [
              invoiceAdjustmentsEtalon[0],
              omit(invoiceAdjustmentsEtalon[1], ['value']),
            ]);
          }).toThrow('There is product with undefined `value` field');
        });

        it('must throws exception if any of invoiceAdjustments has undefined `isPositive` field', () => {
          expect(() => {
            calcDocTotals(invoiceEtalon, invoiceProductsEtalon, [
              invoiceAdjustmentsEtalon[0],
              omit(invoiceAdjustmentsEtalon[1], ['isPositive']),
            ]);
          }).toThrow('There is adjustments with undefined `isPositive` field');
        });

        it('must throws exception if any of invoiceAdjustments has undefined `isDeleted` field', () => {
          expect(() => {
            calcDocTotals(invoiceEtalon, invoiceProductsEtalon, [
              invoiceAdjustmentsEtalon[0],
              omit(invoiceAdjustmentsEtalon[1], ['isDeleted']),
            ]);
          }).toThrow('There is adjustments with undefined `isDeleted` field');
        });

        it('`subtotal` must be calculated with respect to `invoiceAdjustments`', () => {
          const invoiceResult = calcDocTotals(invoiceEtalon, invoiceProductsEtalon, invoiceAdjustmentsEtalon);
          expect(invoiceResult.subtotal).toBe(60000);
        });

        it('`subtotal` must be calculated with respect to `isPositive` field of `invoiceAdjustments`', () => {
          const invoiceResult = calcDocTotals(invoiceEtalon, invoiceProductsEtalon, [
            invoiceAdjustmentsEtalon[0],
            setStateProperties(invoiceAdjustmentsEtalon[1], { isPositive: false }),
          ]);
          expect(invoiceResult.subtotal).toBe(40000);
        });

        it('`subtotal` must be calculated with respect to `isDeleted` field of `invoiceAdjustments`', () => {
          const invoiceResult = calcDocTotals(invoiceEtalon, invoiceProductsEtalon, [
            invoiceAdjustmentsEtalon[0],
            setStateProperties(invoiceAdjustmentsEtalon[1], { isDeleted: true }),
          ]);
          expect(invoiceResult.subtotal).toBe(50000);
        });
      });
    });
  });
});
