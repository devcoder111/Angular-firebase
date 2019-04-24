import { getFrontendURL } from '../../../+utils/config';
import { getFirestore } from '../../../+utils/firestore';
import { getTwilioClient } from '../../../+utils/twilioClient';
import {
  NotificationQueueItem,
  NotificationQueueOrderToSupplierSmsItem,
} from '../../../../../../shared/types/notificationQueueItem.interface';
import { Order } from '../../../../../../shared/types/order.interface';
import { CollectionNames } from '../../../../../../shared/values/collectionNames.map';
import { OrderStatuses } from '../../../../../../shared/values/orderStatuses.array';
import { isPhoneInWhiteList } from '../../../+utils/whiteList';
import { formatPhoneCodeForSms } from '../../../+utils/formatPhoneCodeForSms';

const firestore = getFirestore();

const getTwilioWebhookCallback = (notificationId: string): string => {
  return `${getFrontendURL()}/api/twilio-webhooks/${notificationId}`;
};

export async function sendSmsWithPublicURLToSupplier(commonNotification: NotificationQueueItem): Promise<void> {
  try {
    let notification: NotificationQueueOrderToSupplierSmsItem;
    if (commonNotification.sourceType !== 'orderToSupplier' || commonNotification.type !== 'sms') {
      return;
    }
    notification = commonNotification as NotificationQueueOrderToSupplierSmsItem;
    await sendSms({ statusCallback: getTwilioWebhookCallback(notification.id), ...notification.body });
    console.log('sendSmsWithPublicURLToSupplier - Sms sent. Results:', { notification });
    if (notification.meta.doesTriggerStatusChange) {
      await updateOrderStatusToSent(notification.meta.orderId);
    }
    await firestore
      .collection(`${CollectionNames.notificationsQueue}`)
      .doc(notification.id)
      .update({ processingEndedAt: new Date() });
    console.log('sendSmsWithPublicURLToSupplier - Completed. Order status updated to "sent". Results:', {
      notification,
    });
  } catch (error) {
    console.error('sendSmsWithPublicURLToSupplier', { commonNotification }, error);
    await firestore
      .collection(`${CollectionNames.notificationsQueue}`)
      .doc(commonNotification.id)
      .update({ error: JSON.stringify(error, Object.getOwnPropertyNames(error)) });
    throw new Error(error);
  }
}

export async function sendSms(body: { statusCallback: string; to: string; from: string; body: string }): Promise<void> {
  const smsBody = { ...body, to: formatPhoneCodeForSms(body.to) };
  try {
    console.log('sendSms - Working on:', { smsBody });
    isPhoneInWhiteList(smsBody.to);
    return await getTwilioClient().messages.create(smsBody);
  } catch (error) {
    console.error('sendSms', { smsBody }, error);
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
        console.log('updateLocationCounter - transactionRunAttempt =', transactionRunAttempt);
      }
      const orderRef = firestore.doc(`${CollectionNames.orders}/${orderId}`);
      const orderSnapshot = await transaction.get(orderRef);
      const order = orderSnapshot.data() as Order;
      if (order.status === OrderStatuses.notSent.slug) {
        transaction.update(orderRef, { status: OrderStatuses.sent.slug, processingEndedAt: new Date() });
      }
    });
  } catch (error) {
    console.error('updateOrderStatusToSent', { orderId }, error);
    throw new Error(error);
  }
}
