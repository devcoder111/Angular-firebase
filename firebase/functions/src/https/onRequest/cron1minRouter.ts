import * as crypto from 'crypto';
import * as express from 'express';
import { getConfig } from '../../+utils/config';
import { getFirestore } from '../../+utils/firestore';
import { NotificationQueueItem } from '../../../../../shared/types/notificationQueueItem.interface';
import { CollectionNames } from '../../../../../shared/values/collectionNames.map';
import { sendEmailWithPublicURLToSupplier } from '../../fs/orders/onUpdate/sendEmailWithPublicURLToSupplier';
import { sendFaxWithPublicURLToSupplier } from '../../fs/orders/onUpdate/sendFaxWithPdfToSupplier';
import { sendSmsWithPublicURLToSupplier } from '../../fs/orders/onUpdate/sendSmsWithPublicURLToSupplier';

const router = express.Router();
const firestore = getFirestore();
const config = getConfig();

export const cron1minRouter = createRouter();

function createRouter() {
  router.get('/:key', async (req, res) => {
    try {
      const keyBuffer = Buffer.from(req.params.key, 'utf8');
      const configCronKeyBuffer = Buffer.from(config.cron.key, 'utf8');

      if (!crypto.timingSafeEqual(keyBuffer, configCronKeyBuffer)) {
        console.error(
          'cron1minRouter - The key provided in the request does not match the key set in the environment. Check that',
          req.params.key,
          'matches the cron.key attribute in `firebase env:get`',
        );
        handleError(
          `cron1minRouter - Security key does not match. Make sure your "key" URL query parameter matches the cron.key
       environment variable.`,
          res,
          403,
          `key not valid`,
          {
            paramsKey: req.params.key,
            configKey: config.cron.key,
          },
        );
        return;
      }
      console.log(`cron1minRouter - Key is valid. Working...`);

      const notification = await getNotificationNotProcessed();
      console.log(`cron1minRouter`, { notification });
      if (notification) {
        await Promise.all([
          sendEmailWithPublicURLToSupplier(notification),
          sendSmsWithPublicURLToSupplier(notification),
          sendFaxWithPublicURLToSupplier(notification),
        ]);
      }
      res.sendStatus(200);
    } catch (error) {
      handleError(error, res, 500, 'Something went wrong. Try again later', {
        paramsKey: req.params.key,
        configKey: config.cron.key,
      });
    }
  });

  return router;
}

function handleError(
  error: string,
  res: express.Response,
  status: number,
  text: string,
  params?: { [key: string]: any },
): void {
  console.error('cron1minRouter', { error }, params);
  res.status(status).send(text);
}

async function getNotificationNotProcessed(): Promise<NotificationQueueItem | null> {
  try {
    let transactionRunAttempt = 0;
    let notification: NotificationQueueItem = null;
    await firestore.runTransaction(async transaction => {
      transactionRunAttempt++;
      // if we will see too many "transactionRunAttempt" value in logs - that's a signal to rethink this function
      if (transactionRunAttempt > 1) {
        console.error('getNotificationNotProcessed - transactionRunAttempt =', transactionRunAttempt);
      }
      const notificationsQuerySnapshot = await transaction.get(
        firestore
          .collection(CollectionNames.notificationsQueue)
          .where('processingStartedAt', '==', null)
          .orderBy('timestamp')
          .limit(1),
      );

      if (notificationsQuerySnapshot.empty) {
        notification = null;
        return null;
      } else {
        const notificationSnapshot = notificationsQuerySnapshot.docs[0];
        transaction.update(notificationSnapshot.ref, { processingStartedAt: new Date() });
        notification = { id: notificationSnapshot.id, ...notificationSnapshot.data() } as NotificationQueueItem;
      }
    });
    return notification;
  } catch (error) {
    console.error('getNotificationNotProcessed', error);
    throw new Error(error);
  }
}
