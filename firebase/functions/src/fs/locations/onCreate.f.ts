import * as functions from 'firebase-functions';
import { CollectionNames } from '../../../../../shared/values/collectionNames.map';
import { createCounterInvoicesDone } from './onCreate/createCounterInvoicesDone';
import { createCounterOrderNumber } from './onCreate/createCounterOrderNumber';
import { updatePermission } from './onCreate/updatePermission';

exports = module.exports = functions.firestore
  .document(`${CollectionNames.locations}/{id}`)
  .onCreate(async (snapshot: functions.firestore.DocumentSnapshot) => {
    try {
      await Promise.all([
        updatePermission(snapshot),
        createCounterOrderNumber(snapshot),
        createCounterInvoicesDone(snapshot),
      ]);
    } catch (error) {
      console.error('fsLocationsOnCreate', error);
    }
  });
