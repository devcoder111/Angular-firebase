import * as XRegExp from 'xregexp';
import { getFirestore } from '../../+utils/firestore';
import { OrderPublicPageHTMLFile } from '../../../../../shared/types/file.interface';
import { Order } from '../../../../../shared/types/order.interface';
import { CollectionNames } from '../../../../../shared/values/collectionNames.map';
import { OrderStatuses } from '../../../../../shared/values/orderStatuses.array';
import { StorageFile } from '../onFinalize.f';

const firestore = getFirestore();

/**
 * Regex for string like "organizations/ORG_ID/locations/LOC_ID/users/USER_ID/orders/ORDER_ID/publicPageHTML/FILE_ID"
 */
const regexString = `
organizations\/(?<organizationId>\\w+)\/    # organizations/ORG_ID/
locations\/(?<locationId>\\w+)\/            # locations/LOC_ID/
users\/(?<userId>\\w+)\/                    # users/USER_ID/
orders\/(?<orderId>\\w+)\/                  # orders/ORDER_ID/
publicPageHTML\/(?<fileId>\\w+)$            # publicPageHTML/FILE_ID`;
const regex = XRegExp(regexString, 'x'); // x = free-spacing, newlines and line comments

export async function handleOrderPublicPageHTML(storageFile: StorageFile): Promise<void> {
  try {
    const variables = XRegExp.exec(storageFile.path, regex);
    if (!variables) {
      return;
    }
    const { organizationId, locationId, userId, orderId, fileId } = variables;
    console.log('handleOrderPublicPageHTML - Working on:', {
      storageFile,
      organizationId,
      locationId,
      userId,
      orderId,
      fileId,
    });

    const fileDoc = firestore.doc(`${CollectionNames.files}/${fileId}`);

    const fileSnapshot = await fileDoc.get();
    if (fileSnapshot.exists) {
      console.log('handleOrderPublicPageHTML - file was updated', { storageFile });
      const orderSnapshot = await firestore.doc(`${CollectionNames.orders}/${orderId}`).get();
      const order = { id: orderId, ...orderSnapshot.data() } as Order;
      console.log('handleOrderPublicPageHTML - Order status', { storageFile, order });
      if (order.status === OrderStatuses.voided.slug) {
        await fileDoc.update({ 'meta.status': 'voided' });
        console.log('handleOrderPublicPageHTML - file.meta.status changed to "voided"', { storageFile, order });
      } else {
        console.error(
          'handleOrderPublicPageHTML - Hmm... file was updated, but order status is not "voided". How could it be?',
          { order, storageFile },
        );
        // Not an error, just logic conflict. So no throw new Error(...) here
      }
    } else {
      const file: OrderPublicPageHTMLFile = {
        path: storageFile.path,
        size: Number(storageFile.size),
        md5: storageFile.md5,
        mimeType: storageFile.mimeType,
        organizationId,
        locationId,
        createdAt: new Date(),
        createdBy: userId,
        sourceId: orderId,
        sourceType: 'orderPublicPageHTML',
        meta: {
          status: 'normal',
        },
      };
      console.log('handleOrderPublicPageHTML - new file. Creating document in Firestore', { storageFile, file });
      await fileDoc.set(file);
    }
  } catch (error) {
    console.error('handleOrderPublicPageHTML', { storageFile }, error);
    throw new Error(error);
  }
}
