import { Change } from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import * as request from 'request';
import { createId } from '../../../+utils/createId';
import { hoiio } from '../../../+utils/faxHoiioClient';
import { getFirestore } from '../../../+utils/firestore';
import { getStorageBucket } from '../../../+utils/storageBucket';
import { Order } from '../../../../../../shared/types/order.interface';
import { CollectionNames } from '../../../../../../shared/values/collectionNames.map';
import { OrderStatuses } from '../../../../../../shared/values/orderStatuses.array';
import { isFaxInWhiteList } from '../../../+utils/whiteList';

const fse = require('fs-extra');

const bucket = getStorageBucket();
const firestore = getFirestore();

export async function sendFaxWithCancellationToSupplier(change: Change<DocumentSnapshot>): Promise<void> {
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
    const pdfPath = await uploadFileAndGetFaxPdfPath(
      'organizations/BMWOrg/locations/PRA/users/00000001/orders/ORDER1/pdfs/FILE1',
    );
    const faxPhoneNumber = await getSupplierFaxPhoneNumber(order);
    await sendVoidedFax(faxPhoneNumber, pdfPath);
  } catch (error) {
    console.error('sendFaxWithCancellationToSupplier - ', { change, error });
    throw new Error(error);
  }
}

export async function uploadFileAndGetFaxPdfPath(filePathInBucket: string): Promise<string> {
  //@TODO add path to file param like 'organizations/BMWOrg/locations/PRA/users/00000001/orders/ORDER1/pdfs/FILE1'
  const pdfDir = `/tmp/${createId()}`;
  await Promise.all([fse.ensureDir(pdfDir)]);
  const pathToPDF = `${pdfDir}/src.pdf`;
  try {
    await bucket.file(filePathInBucket).download({ destination: pathToPDF });
    console.log('getFaxPdfPath - bucket.file downloaded!');
    await fse.ensureFile(pathToPDF);
    return pathToPDF;
  } catch (error) {
    console.error('getFaxPdfPath - failed to download PDF', { filePathInBucket, pathToPDF }, error);
    throw new Error(error);
  }
}

export async function getSupplierFaxPhoneNumber(order: Order): Promise<string> {
  try {
    const snapshot = await firestore.doc(`${CollectionNames.suppliers + '/' + order.supplierId}`).get();
    if (snapshot.data().orderMethods.fax) {
      return snapshot.data().orderMethods.fax.value;
    } else {
      return null;
    }
  } catch (error) {
    console.error('getSupplierFaxNumber - ', { order, error });
    throw new Error(error);
  }
}

export async function sendVoidedFax(faxNumber: string, pathToPDF: string): Promise<void> {
  try {
    const formData = {
      // Pass a simple key-value pair
      app_id: hoiio.app_id,
      access_token: hoiio.access_token,
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
      function optionalCallback(error, httpResponse, body) {
        if (error) {
          console.error('sendVoidedFax - upload failed:', error);
          throw new Error(error);
        }
        console.log('sendVoidedFax - successfully uploaded, Server responded with:', body);
      },
    );
  } catch (error) {
    console.error('sendVoidedFax', { faxNumber, error });
    throw new Error(error);
  }
}

export async function base64_encode(file) {
  // read binary data
  try {
    const bitmap = await fse.readFileSync(file);
    return Buffer.from(bitmap).toString('base64');
  } catch (error) {
    console.error('base64_encode', { file, error });
    throw new Error(error);
  }
  // convert binary data to base64 encoded string
}
