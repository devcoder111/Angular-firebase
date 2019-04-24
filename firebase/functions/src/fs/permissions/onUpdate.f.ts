import * as functions from 'firebase-functions';
import { CollectionNames } from '../../../../../shared/values/collectionNames.map';
import { updateLocations } from './onUpdate/updateLocations';

exports = module.exports = functions.firestore
  .document(`${CollectionNames.permissions}/{id}`)
  .onUpdate(async (change: functions.Change<functions.firestore.DocumentSnapshot>) => {
    try {
      await updateLocations(change);
    } catch (error) {
      console.error('fsPermissionsOnUpdate', error);
    }
  });
