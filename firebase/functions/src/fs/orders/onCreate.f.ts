import * as functions from 'firebase-functions';
import { CollectionNames } from '../../../../../shared/values/collectionNames.map';
import { createOrderNumber } from './onCreate/createOrderNumber';

exports = module.exports = functions.firestore
  .document(`${CollectionNames.orders}/{id}`)
  .onCreate(async (snapshot: functions.firestore.DocumentSnapshot) => {
    try {
      await createOrderNumber(snapshot);
    } catch (error) {
      console.error('fsOrdersOnCreate', error);
    }
  });
