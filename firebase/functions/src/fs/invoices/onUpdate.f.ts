import * as functions from 'firebase-functions';
import { CollectionNames } from '../../../../../shared/values/collectionNames.map';
import { updateLocationCounter } from './onUpdate/updateLocationCounter';
import { updateOrganizationCounter } from './onUpdate/updateOrganizationCounter';

exports = module.exports = functions.firestore
  .document(`${CollectionNames.invoices}/{id}`)
  .onUpdate(async (change: functions.Change<functions.firestore.DocumentSnapshot>) => {
    try {
      await Promise.all([updateLocationCounter(change), updateOrganizationCounter(change)]);
    } catch (error) {
      console.error('fsInvoicesOnUpdate', error);
    }
  });
