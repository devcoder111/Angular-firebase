import * as functions from 'firebase-functions';
import { CollectionNames } from '../../../../../shared/values/collectionNames.map';
import { createOrderPublicPageOnUpdate } from './onUpdate/createPublicPage';
import { sendEmailWithCancellationToSupplier } from './onUpdate/sendEmailWithCancellationToSupplier';
import { sendFaxWithCancellationToSupplier } from './onUpdate/sendFaxWithCancellationToSupplier';
import { sendSmsWithCancellationToSupplier } from './onUpdate/sendSmsWithCancellationToSupplier';
import { voidOriginalTemplatePurgePublicPage } from './onUpdate/voidOriginalTemplatePurgePublicPage';

exports = module.exports = functions.firestore
  .document(`${CollectionNames.orders}/{id}`)
  .onUpdate(async (change: functions.Change<functions.firestore.DocumentSnapshot>) => {
    try {
      await Promise.all([
        createOrderPublicPageOnUpdate(change),
        voidOriginalTemplatePurgePublicPage(change),
        sendEmailWithCancellationToSupplier(change),
        sendSmsWithCancellationToSupplier(change),
        sendFaxWithCancellationToSupplier(change),
      ]);
    } catch (error) {
      console.error('fsOrdersOnUpdate', error);
    }
  });
