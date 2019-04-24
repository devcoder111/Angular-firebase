import * as express from 'express';
import { getFirestore } from '../../../+utils/firestore';
import { CollectionNames } from '../../../../../../shared/values/collectionNames.map';
import { NotificationStatuses } from '../../../../../../shared/values/notificationStatuses.array';

const router = express.Router();
const firestore = getFirestore();

export const sendgridWebhooks = createRouter();

function createRouter() {
  router.post('', async (req, res) => {
    try {
      console.log('createRouter sendgrid.webhooks data -', { body: req.body, params: req.params });
      await asyncForEach(req.body, async sendgridEmailEventData => {
        console.log('createRouter sendgrid.webhooks - working on', sendgridEmailEventData);
        await getNotificationByIdAndUpdate(sendgridEmailEventData.notificationId, sendgridEmailEventData);
      });
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
  console.error('sendgrid.webhooks', { error }, params);
  res.status(status).send(text);
}

async function getNotificationByIdAndUpdate(notificationId, dataFromSendgrid): Promise<void> {
  const updateFields = {
    status: dataFromSendgrid.event === 'delivered' ? NotificationStatuses.sent.slug : NotificationStatuses.notSent.slug,
    error: dataFromSendgrid.reason ? dataFromSendgrid.reason : null,
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

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
