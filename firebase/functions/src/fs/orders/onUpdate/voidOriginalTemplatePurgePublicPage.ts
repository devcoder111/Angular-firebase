import { Change } from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import { Order } from '../../../../../../shared/types/order.interface';
import { OrderStatuses } from '../../../../../../shared/values/orderStatuses.array';
import { getOrderProducts, getPublicOrderHTML, getSupplierById, uploadPublicPageTemplate } from './createPublicPage';

const request = require('request');

export async function voidOriginalTemplatePurgePublicPage(change: Change<DocumentSnapshot>): Promise<void> {
  try {
    const before: Order = change.before.data() as any;
    const after: Order = change.after.data() as any;
    const orderId = change.after.id;
    const order = { id: orderId, ...after } as Order;
    const prevStatusIsntVoided = before.status !== OrderStatuses.voided.slug;
    const currentStatusIsVoided = after.status === OrderStatuses.voided.slug;
    const rightCondition = prevStatusIsntVoided && currentStatusIsVoided;
    if (!rightCondition) {
      return null;
    }
    await voidOriginalTemplate(order);
    await request(`${order.publicPage.html.url}`, { method: 'PURGE' });
    console.log('voidOriginalTemplatePurgePublicPage - completed', { change, order });
  } catch (error) {
    console.error('voidOriginalTemplatePurgePublicPage - ', { change, error });
    throw new Error(error);
  }
}

export async function voidOriginalTemplate(order: Order): Promise<any> {
  console.log('voidOriginalTemplate - start', { order });
  try {
    const [orderProducts, supplier] = await Promise.all([
      getOrderProducts(order.id),
      getSupplierById(order.supplierId),
    ]);

    const html = await getPublicOrderHTML(order, orderProducts, supplier, null);
    console.log('voidOriginalTemplate - HTML generated', { order });

    const filePath = await uploadPublicPageTemplate(html, order.publicPage.html.fileId, order, order.id);
    console.log('voidOriginalTemplate - HTML uploaded to Storage', { order, filePath });
  } catch (error) {
    console.error('voidOriginalTemplate', { order, error });
    throw new Error(error);
  }
}
