import * as express from 'express';
import { getFirestore } from '../../../+utils/firestore';
import { CollectionNames } from '../../../../../../shared/values/collectionNames.map';
import { NotificationStatuses } from '../../../../../../shared/values/notificationStatuses.array';

const router = express.Router();
const firestore = getFirestore();

export const hoiioWebhooks = createRouter();

function createRouter() {
  router.post('/:notificationId', async (req, res) => {
    try {
      console.log('createRouter hoiio.webhooks', { body: req.body, params: req.params });
      if (req.body && req.params && ['sent', 'failed', 'undelivered'].indexOf(req.body.status) > -1) {
        await getNotificationByIdAndUpdate(req.params.notificationId, req.body);
      }
      res.sendStatus(200);
    } catch (error) {
      handleError(error, res, 500, 'Something went wrong. Try again later', {
        paramsNotificationId: req.params.notificationId,
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
  params?: { [notificationId: string]: any },
): void {
  console.error('hoiio.webhooks', { error }, params);
  res.status(status).send(text);
}

async function getNotificationByIdAndUpdate(notificationId, dataFromHoiio): Promise<void> {
  console.log('getNotificationByIdAndUpdate', { notificationId, dataFromHoiio });
  const updateFields = {
    status:
      dataFromHoiio.status === NotificationStatuses.sent.slug
        ? NotificationStatuses.sent.slug
        : NotificationStatuses.notSent.slug,
    error: dataFromHoiio.error_message,
  };
  try {
    await firestore
      .collection(`${CollectionNames.notificationsQueue}`)
      .doc(notificationId)
      .update({ ...updateFields });
    console.log('getNotificationByIdAndUpdate - done', { notificationId, ...updateFields });
  } catch (error) {
    console.error('getNotificationByIdAndUpdate', error);
    throw new Error(error);
  }
}
