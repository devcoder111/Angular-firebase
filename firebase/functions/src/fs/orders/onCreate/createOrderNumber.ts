import { CounterLocationOrderNumber } from '@shared/types/counterLocationOrderNumber.interface';
import { Order } from '@shared/types/order.interface';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import { getFirestore } from '../../../+utils/firestore';
import { CollectionNames } from '../../../../../../shared/values/collectionNames.map';

const firestore = getFirestore();

export async function createOrderNumber(snapshot: DocumentSnapshot): Promise<string | null> {
  try {
    const id = snapshot.id;
    const order: Order = snapshot.data() as any;
    const locationId = order.locationId;
    const path = `${CollectionNames.countersLocationOrderNumber}/${locationId}`;
    const orderNumberCounterRef = firestore.doc(path);
    const orderRef = snapshot.ref;

    if (order.number) {
      return null;
      // Order is most probably imported as demo-data, so it already contains number.
      // Firestore Security Rules prevents order creation with number filled, so order with number
      // could be created only on server side.
    }

    console.log('createOrderNumber - Working on order:', { id, ...order });

    let orderNumber = null;
    let orderNumberCounterBefore = null;
    let orderNumberCounterAfter = null;
    let transactionRunAttempt = 0;
    await firestore.runTransaction(async transaction => {
      transactionRunAttempt++;
      if (transactionRunAttempt > 1) {
        // if we will see too many "transactionRunAttempt" value in logs - that's a signal to rethink this function
        console.error('updateLocationCounter - transactionRunAttempt =', transactionRunAttempt);
      }
      const orderNumberCounterSnapshot = await transaction.get(orderNumberCounterRef);
      const orderNumberCounter = orderNumberCounterSnapshot.data() as CounterLocationOrderNumber;
      orderNumberCounterBefore = { ...orderNumberCounter };
      orderNumberCounter.number++;
      orderNumberCounterAfter = { ...orderNumberCounter };
      transaction.set(orderNumberCounterRef, orderNumberCounter);
      orderNumber = generateNumber(orderNumberCounter.number, orderNumberCounter.locationCode);
      transaction.update(orderRef, { number: orderNumber });
    });
    console.log('createOrderNumber - completed. Results:', {
      orderNumber,
      orderNumberCounterBefore,
      orderNumberCounterAfter,
    });
    return orderNumber;
  } catch (error) {
    console.error('createOrderNumber', error);
    throw new Error(error);
  }
}

/**
 * Generates order number with format "YYAAA0000", where "YY" - year, "AAA" - location's code, "0000" - index number
 * @param {number} index - index number
 * @param {string} locationCode
 * @returns {string} Generated order number. Example: "18ABC0001"
 */
function generateNumber(index: number, locationCode: string): string {
  const strIndexNumber = String('000' + index).slice(-4); // adds "0" in the beginning so it is "0001" for ex.
  const year = new Date()
    .getFullYear()
    .toString()
    .substr(2); // takes "18" from "2018"
  return `${year}${locationCode}${strIndexNumber}`;
}
