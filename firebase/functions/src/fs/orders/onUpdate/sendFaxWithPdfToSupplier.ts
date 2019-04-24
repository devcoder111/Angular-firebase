import * as request from 'request';
import { getFrontendURL } from '../../../+utils/config';
import { hoiio } from '../../../+utils/faxHoiioClient';
import { getFirestore } from '../../../+utils/firestore';
import {
  NotificationQueueItem,
  NotificationQueueOrderToSupplierFaxItem,
} from '../../../../../../shared/types/notificationQueueItem.interface';
import { Order } from '../../../../../../shared/types/order.interface';
import { CollectionNames } from '../../../../../../shared/values/collectionNames.map';
import { OrderStatuses } from '../../../../../../shared/values/orderStatuses.array';
import { base64_encode, uploadFileAndGetFaxPdfPath } from './sendFaxWithCancellationToSupplier';
import { isFaxInWhiteList } from '../../../+utils/whiteList';

const querystring = require('querystring');

const firestore = getFirestore();

const getHoiioWebhookCallback = (notificationId: string): string => {
  return `${getFrontendURL()}/api/hoiio-webhooks/${querystring.escape(notificationId)}`;
};

export async function sendFaxWithPublicURLToSupplier(commonNotification: NotificationQueueItem): Promise<void> {
  try {
    let notification: NotificationQueueOrderToSupplierFaxItem;
    if (commonNotification.sourceType !== 'orderToSupplier' || commonNotification.type !== 'fax') {
      return;
    }
    notification = commonNotification as NotificationQueueOrderToSupplierFaxItem;
    await sendFax({ notify_url: getHoiioWebhookCallback(notification.id), ...notification.body });
    console.log('sendFaxWithPublicURLToSupplier - Fax sent. Results:', { notification });
    if (notification.meta.doesTriggerStatusChange) {
      await updateOrderStatusToSent(notification.meta.orderId);
    }
    await firestore
      .collection(`${CollectionNames.notificationsQueue}`)
      .doc(notification.id)
      .update({ processingEndedAt: new Date() });
    console.log('sendFaxWithPublicURLToSupplier - Completed. Order status updated to "sent". Results:', {
      notification,
    });
  } catch (error) {
    console.error('sendFaxWithPublicURLToSupplier', { commonNotification }, error);
    await firestore
      .collection(`${CollectionNames.notificationsQueue}`)
      .doc(commonNotification.id)
      .update({ error: JSON.stringify(error, Object.getOwnPropertyNames(error)) });
    throw new Error(error);
  }
}

export async function sendFax(body: { notify_url: string; file: string; dest: string }): Promise<void> {
  try {
    console.log('sendFax - Working on:', { body });

    const pathToPDF = await uploadFileAndGetFaxPdfPath(
      'organizations/BMWOrg/locations/PRA/users/00000001/orders/ORDER1/pdfs/FILE1',
    );

    const formData = {
      // Pass a simple key-value pair
      app_id: hoiio.app_id,
      access_token: hoiio.access_token,
      notify_url: body.notify_url,
      file: await base64_encode(pathToPDF),
      dest: '+6564916415', //@TODO change TESTING PHONE to getSupplierFaxNumber(order);
      // Pass data via Buffers
    };
    isFaxInWhiteList(formData.dest);
    await request.post(
      {
        url: 'http://secure.hoiio.com/open/fax/send',
        formData: formData,
        headers: {
          'User-Agent': 'request',
          'Content-Type': 'multipart/form-data',
        },
      },
      function optionalCallback(error, httpResponse, data) {
        if (error) {
          console.error('sendVoidedFax - upload failed:', error);
          throw new Error(error);
        }
        console.log('sendVoidedFax - successfully uploaded, Server responded with:', data);
      },
    );
  } catch (error) {
    console.error('sendFax', { body }, error);
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
