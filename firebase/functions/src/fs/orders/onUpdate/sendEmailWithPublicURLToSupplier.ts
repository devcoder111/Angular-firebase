import { getFirestore } from '../../../+utils/firestore';
import { getMailClient } from '../../../+utils/mailClient';
import {
  NotificationQueueItem,
  NotificationQueueOrderToSupplierEmailItem,
} from '../../../../../../shared/types/notificationQueueItem.interface';
import { Order } from '../../../../../../shared/types/order.interface';
import { CollectionNames } from '../../../../../../shared/values/collectionNames.map';
import { OrderStatuses } from '../../../../../../shared/values/orderStatuses.array';
import { isEmailInWhiteList } from '../../../+utils/whiteList';

const firestore = getFirestore();

export async function sendEmailWithPublicURLToSupplier(commonNotification: NotificationQueueItem): Promise<void> {
  try {
    let notification: NotificationQueueOrderToSupplierEmailItem;
    if (commonNotification.sourceType !== 'orderToSupplier' || commonNotification.type !== 'email') {
      return;
    }
    notification = commonNotification as NotificationQueueOrderToSupplierEmailItem;
    const sendEmailRes = await sendEmail(notification.body);
    console.log('sendEmailWithPublicURLToSupplier - Email sent. Results:', { sendEmailRes, notification });
    if (notification.meta.doesTriggerStatusChange) {
      await updateOrderStatusToSent(notification.meta.orderId);
    }
    await firestore
      .collection(`${CollectionNames.notificationsQueue}`)
      .doc(notification.id)
      .update({ processingEndedAt: new Date() });
    console.log('sendEmailWithPublicURLToSupplier - Completed. Order status updated to "sent". Results:', {
      notification,
    });
  } catch (error) {
    console.error('sendEmailWithPublicURLToSupplier', { commonNotification }, error);
    await firestore
      .collection(`${CollectionNames.notificationsQueue}`)
      .doc(commonNotification.id)
      .update({ error: JSON.stringify(error, Object.getOwnPropertyNames(error)) });
    throw new Error(error);
  }
}

export async function sendEmail(body: any): Promise<any> {
  try {
    console.log('sendEmail - Working on:', { body });
    isEmailInWhiteList(body.to);
    return await getMailClient().send(body);
  } catch (error) {
    console.error('sendEmail', { body }, error);
    throw new Error(error);
  }
}

async function updateOrderStatusToSent(orderId: string): Promise<void> {
  try {
    let transactionRunAttempt = 0;
    await firestore.runTransaction(async transaction => {
      transactionRunAttempt++;
      if (transactionRunAttempt > 1) {
        // if we will see too many "transactionRunAttempt" value in logs - that's a signal to rethink this function
        console.error('updateLocationCounter - transactionRunAttempt =', transactionRunAttempt);
      }
      const orderRef = firestore.doc(`${CollectionNames.orders}/${orderId}`);
      const orderSnapshot = await transaction.get(orderRef);
      const order = orderSnapshot.data() as Order;
      if (order.status === OrderStatuses.notSent.slug) {
        transaction.update(orderRef, { status: OrderStatuses.sent.slug });
      }
    });
  } catch (error) {
    console.error('updateOrderStatusToSent', { orderId }, error);
    throw new Error(error);
  }
}
