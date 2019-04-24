import * as express from 'express';
import { getFirestore } from '../../+utils/firestore';
import { getStorageBucket } from '../../+utils/storageBucket';
import { OrderPublicPagePDFFile } from '../../../../../shared/types/file.interface';
import { CollectionNames } from '../../../../../shared/values/collectionNames.map';

const router = express.Router();
const bucket = getStorageBucket();
const firestore = getFirestore();

export const orderPublicPagePDFRouter = createRouter();

function createRouter() {
  router.get('/:id', async (req, res) => {
    const fileId = req.params.id;
    let file: OrderPublicPagePDFFile = null;
    try {
      console.log('orderPublicPagePDFRouter - Working on order with publicPage.pdf.fileId:', fileId);
      const twoWeeks = 60 * 60 * 24 * 14;
      const fiveMinutes = 60 * 5;
      res.set(`Cache-Control`, `public, s-maxage=${twoWeeks}, max-age=${fiveMinutes}`);
      const results = await Promise.all([getFile(fileId)]);
      file = results[0];
      if (!file) {
        console.log('orderPublicPagePDFRouter - No file with id:', fileId);
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
        console.log('orderPublicPagePDFRouter - completed. File sent.', { fileId });
        return res.send(data);
      })
      .pipe(res);
  });

  return router;
}

function handleError(error, res, fileId) {
  console.error('orderPublicPagePDFRouter', { fileId }, error);
  return res.status(500).send('Something went wrong. Try again later');
}

async function getFile(fileId: string): Promise<OrderPublicPagePDFFile | null> {
  const fileSnapshot = await firestore.doc(`${CollectionNames.files}/${fileId}`).get();
  if (fileSnapshot.exists) {
    return { ...fileSnapshot.data() } as OrderPublicPagePDFFile;
  } else {
    return null;
  }
}
