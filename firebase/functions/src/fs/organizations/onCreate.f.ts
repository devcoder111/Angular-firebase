import * as functions from 'firebase-functions';
import { CollectionNames } from '../../../../../shared/values/collectionNames.map';
import { fsCreateDefaultProductCategories } from './onCreate/createDefaultProductCategories';
import { createCounterInvoicesDone } from './onCreate/createCounterInvoicesDone';

exports = module.exports = functions.firestore
  .document(`${CollectionNames.organizations}/{id}`)
  .onCreate(async (snapshot: functions.firestore.DocumentSnapshot) => {
    try {
      await Promise.all([fsCreateDefaultProductCategories(snapshot), createCounterInvoicesDone(snapshot)]);
    } catch (error) {
      console.error('fsOrganizationsOnCreate', error);
    }
  });
