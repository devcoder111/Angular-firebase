import { Change } from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import { getConfig } from '../../../+utils/config';
import { getFirestore } from '../../../+utils/firestore';
import { getTwilioClient } from '../../../+utils/twilioClient';
import { Order } from '../../../../../../shared/types/order.interface';
import { CollectionNames } from '../../../../../../shared/values/collectionNames.map';
import { OrderStatuses } from '../../../../../../shared/values/orderStatuses.array';
import { isPhoneInWhiteList } from '../../../+utils/whiteList';

const firestore = getFirestore();

export async function sendSmsWithCancellationToSupplier(change: Change<DocumentSnapshot>): Promise<void> {
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
    await sendVoidSmsToSupplier(order);
  } catch (error) {
    console.error('sendSmsWithCancellationToSupplier - ', { change, error });
    throw new Error(error);
  }
}

export async function sendVoidSmsToSupplier(order: Order): Promise<void> {
  try {
    console.log('sendVoidSmsToSupplier - Working on:', { order });
    const phoneNumber = await getSupplierPhoneNumber(order);
    if (!phoneNumber || !validE164(phoneNumber)) {
      console.error('sendVoidSmsToSupplier - No phone number or phone number has wrong format', {
        order,
        phoneNumber,
      });
      return null;
    }
    try {
      const textMessage = {
        from: getConfig().twilio.from,
        to: phoneNumber,
        body: `Order ${order.number} was voided. The reason is: ${order.voidReason}
         Click here to see more => ${order.publicPage.html.url} 
      `,
      };
      console.log('sendVoidSms - Working on:', { textMessage });
      isPhoneInWhiteList(textMessage.to);
      await getTwilioClient().messages.create(textMessage);
      console.log('sendVoidSms - complete.', { textMessage });
    } catch (error) {
      console.error('sendVoidSms', { phoneNumber, error });
      throw new Error(error);
    }
    console.log('sendVoidSmsToSupplier - Sms sent. Results:', { order, phoneNumber });
  } catch (error) {
    console.error('sendVoidSmsToSupplier - ', { order, error });
    throw new Error(error);
  }
}

export async function getSupplierPhoneNumber(order: Order): Promise<string> {
  try {
    // TODO: remake to "get supplier for this order and get his phone number"
    const snapshot = await firestore.doc(`${CollectionNames.suppliers + '/' + order.supplierId}`).get();
    if (snapshot.data().orderMethods.sms) {
      return snapshot.data().orderMethods.sms.value;
    } else {
      return null;
    }
  } catch (error) {
    console.error('getSupplierPhoneNumber - ', { order, error });
    throw new Error(error);
  }
}

function validE164(phoneNumber) {
  return /^\+?[1-9]\d{1,14}$/.test(phoneNumber);
}
