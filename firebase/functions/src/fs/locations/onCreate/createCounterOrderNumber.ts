import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import { getFirestore } from '../../../+utils/firestore';
import { CounterLocationOrderNumber } from '../../../../../../shared/types/counterLocationOrderNumber.interface';
import { Location } from '../../../../../../shared/types/location.interface';
import { CollectionNames } from '../../../../../../shared/values/collectionNames.map';

const firestore = getFirestore();

export async function createCounterOrderNumber(snapshot: DocumentSnapshot): Promise<void> {
  try {
    const id = snapshot.id;
    const location: Location = snapshot.data() as any;
    const counterPath = `${CollectionNames.countersLocationOrderNumber}/${id}`;
    const counterRef = firestore.doc(counterPath);
    const counterBody: CounterLocationOrderNumber = { locationCode: location.code, number: 0 };

    console.log('createCounterOrderNumber - Working on location:', { id, ...location });

    let transactionRunAttempt = 0;
    await firestore.runTransaction(async transaction => {
      transactionRunAttempt++;
      if (transactionRunAttempt > 1) {
        // if we will see too many "transactionRunAttempt" value in logs - that's a signal to rethink this function
        console.error('updateLocationCounter - transactionRunAttempt =', transactionRunAttempt);
      }
      transaction.create(counterRef, counterBody);
    });
    console.log('createCounterOrderNumber - completed. Results:', { counterBody, counterPath });
  } catch (error) {
    console.error('createCounterOrderNumber', error);
    throw new Error(error);
  }
}
