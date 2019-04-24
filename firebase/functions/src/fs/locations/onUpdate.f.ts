import * as functions from 'firebase-functions';
import { CollectionNames } from '../../../../../shared/values/collectionNames.map';
import { updateCounterOrderNumber } from './onUpdate/updateCounterOrderNumber';

exports = module.exports = functions.firestore
  .document(`${CollectionNames.locations}/{id}`)
  .onUpdate(async (change: functions.Change<functions.firestore.DocumentSnapshot>) => {
    try {
      await updateCounterOrderNumber(change);
    } catch (error) {
      console.error('fsLocationsOnUpdate', error);
    }
  });
