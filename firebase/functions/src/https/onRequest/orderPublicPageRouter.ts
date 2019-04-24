import * as express from 'express';
import { getFirestore } from '../../+utils/firestore';
import { getStorageBucket } from '../../+utils/storageBucket';
import { OrderPublicPageHTMLFile } from '../../../../../shared/types/file.interface';
import { CollectionNames } from '../../../../../shared/values/collectionNames.map';
import { OrderStatuses } from '../../../../../shared/values/orderStatuses.array';

const router = express.Router();
const bucket = getStorageBucket();
const firestore = getFirestore();

export const orderPublicPageRouter = createRouter();

function createRouter() {
  router.get('/:id', async (req, res) => {
    const fileId = req.params.id;
    let file: OrderPublicPageHTMLFile = null;
    try {
      console.log('orderPublicPageRouter - Working on order with publicPage.html.fileId:', fileId);
      const twoWeeks = 60 * 60 * 24 * 14;
      const fiveMinutes = 60 * 5;
      res.set(`Cache-Control`, `public, s-maxage=${twoWeeks}, max-age=${fiveMinutes}`);
      const results = await Promise.all([getFile(fileId), changeOrderStatusToRead(fileId)]);
      file = results[0];
      if (!file) {
        console.error('orderPublicPageRouter - No file with id:', fileId);
        return res.status(404).send('It seems this page is not available anymore');
      }
    } catch (error) {
      return handleError(error, res, fileId);
    }
    bucket
      .file(file.path)
      .createReadStream()
      .on('error', error => {
        return handleError(error, res, fileId);
      })
      .on('end', async data => {
        console.log('orderPublicPageRouter - completed. File sent.', { fileId });
        return res.send(data);
      })
      .pipe(res);
  });

  return router;
}

function handleError(error, res, fileId) {
  console.error('orderPublicPageRouter', { fileId }, error);
  return res.status(500).send('Something went wrong. Try again later');
}

async function getFile(fileId: string): Promise<OrderPublicPageHTMLFile | null> {
  const fileSnapshot = await firestore.doc(`${CollectionNames.files}/${fileId}`).get();
  if (fileSnapshot.exists) {
    return { ...fileSnapshot.data() } as OrderPublicPageHTMLFile;
  } else {
    return null;
  }
}

async function changeOrderStatusToRead(fileId: string): Promise<void> {
  let order;
  console.log('changeOrderStatusToRead - Looking for order  with status "sent" and publicPage.html.fileId:', {
    fileId,
  });
  try {
    const ordersQuerySnapshot = await firestore
      .collection(CollectionNames.orders)
      .where('publicPage.html.fileId', '==', fileId)
      .where('status', '==', OrderStatuses.sent.slug)
      .limit(1)
      .get();
    if (ordersQuerySnapshot.empty) {
      console.log('changeOrderStatusToRead - No order with status "sent" and publicPage.html.fileId:', { fileId });
      return;
    }
    const orderSnapshot = ordersQuerySnapshot.docs[0];
    order = { id: orderSnapshot.id, ...orderSnapshot.data() };
    console.log('changeOrderStatusToRead - Order found:', { fileId, order });
  } catch (error) {
    console.error('changeOrderStatusToRead - Query order document error:', error);
    throw new Error(error);
  }

  try {
    await firestore.doc(`${CollectionNames.orders}/${order.id}`).update({
      status: OrderStatuses.read.slug,
      'publicPage.openedAt': new Date(),
    });
    console.log('changeOrderStatusToRead - Completed. Document status updated to "read".', { fileId, order });
  } catch (error) {
    console.error('changeOrderStatusToRead - Error saving document:', { fileId, order }, error);
    throw new Error(error);
  }
}
