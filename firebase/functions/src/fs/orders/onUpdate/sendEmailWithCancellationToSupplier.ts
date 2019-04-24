import { Change } from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import { createId } from '../../../+utils/createId';
import { getFirestore } from '../../../+utils/firestore';
import { NotificationQueueOrderToSupplierEmailItem } from '../../../../../../shared/types/notificationQueueItem.interface';
import { Order } from '../../../../../../shared/types/order.interface';
import { CollectionNames } from '../../../../../../shared/values/collectionNames.map';
import { OrderStatuses } from '../../../../../../shared/values/orderStatuses.array';
import { getOrderProducts, getPublicOrderHTML, getSupplierById, uploadPublicPageTemplate } from './createPublicPage';
import { isEmailInWhiteList } from '../../../+utils/whiteList';

const firestore = getFirestore();

export async function sendEmailWithCancellationToSupplier(change: Change<DocumentSnapshot>): Promise<void> {
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
    await sendVoidEmailToSupplier(order);
  } catch (error) {
    console.error('sendEmailWithCancellationToSupplier - ', { change, error });
    throw new Error(error);
  }
}

export async function sendVoidEmailToSupplier(order: Order): Promise<void> {
  try {
    console.log('sendVoidEmailToSupplier - Working on:', { order });
    const email = await getSupplierEmailAddress(order);

    if (!email) {
      console.error('sendVoidEmailToSupplier - No email to send public link to', {
        order,
      });
      return null;
    }
    isEmailInWhiteList(email);
    await addVoidEmailToNotificationToQueue(email, order);
    console.log('sendVoidEmailToSupplier - Email added to the queue. Results:', { order, email });
  } catch (error) {
    console.error('sendVoidEmailToSupplier - ', { order, error });
    throw new Error(error);
  }
}

export async function getSupplierEmailAddress(order: Order): Promise<string> {
  try {
    // TODO: remake to "get supplier for this order and get his email"
    const snapshot = await firestore.doc(`${CollectionNames.suppliers + '/' + order.supplierId}`).get();
    if (snapshot.data().orderMethods.email) {
      return snapshot.data().orderMethods.email.value;
    } else {
      return null;
    }
  } catch (error) {
    console.error('getSupplierEmailAddress - ', { order, error });
    throw new Error(error);
  }
}

export async function addVoidEmailToNotificationToQueue(email: string, order): Promise<void> {
  if (!email) {
    console.log("addVoidEmailToNotificationToQueue - supplier doesn't have email. Skipping this step", {
      order,
    });
    return null;
  }

  const notificationId = createId();
  const NotificationItem: NotificationQueueOrderToSupplierEmailItem = {
    type: 'email',
    sourceType: 'orderToSupplier',
    timestamp: new Date(),
    processingStartedAt: null,
    processingEndedAt: null,
    error: null,
    body: {
      customArgs: {
        notificationId,
      },
      from: 'noreply@foodrazor.com',
      to: email,
      subject: 'Order was voided',
      html: `
        <h1>
         Order ${order.number} was voided.<br> 
         The reason is:<br>
         <code>${order.voidReason}</code><br>
         <a href="${order.publicPage.html.url}">Click here to see more</a>
        </h1>
      `,
    },
    meta: {
      orderId: order.id,
      orderNumber: order.number || null,
      supplierId: order.supplierId,
      supplierName: order.supplierName || null,
      doesTriggerStatusChange: true,
      attemptsAmount: 0,
      lastAttemptAt: null,
    },
    status: 'notSent',
  };

  try {
    await firestore.doc(`${CollectionNames.notificationsQueue}/${notificationId}`).set(NotificationItem);
    console.log('addVoidEmailToNotificationToQueue created', { order });
  } catch (error) {
    console.error('addVoidEmailToNotificationToQueue', { order }, error);
    throw new Error(error);
  }
}

export async function voidOriginalTemplate(order: Order): Promise<any> {
  console.log('voidOriginalTemplate - start', { order });
  try {
    const orderProducts = await getOrderProducts(order.id);

    const supplier = await getSupplierById(order.supplierId);

    const html = await getPublicOrderHTML(order, orderProducts, supplier, null);
    console.log('voidOriginalTemplate - HTML generated', { order });

    const filePath = await uploadPublicPageTemplate(html, order.publicPage.html.fileId, order, order.id);
    console.log('voidOriginalTemplate - HTML uploaded to Storage', { order, filePath });
  } catch (error) {
    console.error('voidOriginalTemplate', { order, error });
    throw new Error(error);
  }
}
