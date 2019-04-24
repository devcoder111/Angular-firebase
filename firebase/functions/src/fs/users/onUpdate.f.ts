import * as functions from 'firebase-functions';
import { CollectionNames } from '../../../../../shared/values/collectionNames.map';
import { updatePermissions } from './onUpdate/updatePermissions';

exports = module.exports = functions.firestore
  .document(`${CollectionNames.users}/{id}`)
  .onUpdate(async (change: functions.Change<functions.firestore.DocumentSnapshot>) => {
    try {
      await updatePermissions(change);
    } catch (error) {
      console.error('fsUsersOnUpdate', error);
    }
  });
