import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import { getFirestore } from '../../../+utils/firestore';
import { CounterOrganizationInvoicesDone } from '../../../../../../shared/types/counterOrganizationInvoicesDone.interface';
import { CollectionNames } from '../../../../../../shared/values/collectionNames.map';
import { Organization } from '@shared/types/organization.interface';

const firestore = getFirestore();

export async function createCounterInvoicesDone(snapshot: DocumentSnapshot): Promise<void> {
  try {
    const id = snapshot.id;
    const organization: Organization = snapshot.data() as any;
    const counterPath = `${CollectionNames.countersOrganizationInvoicesDone}/${id}`;
    const counterRef = firestore.doc(counterPath);
    const counterBody: CounterOrganizationInvoicesDone = { amount: 0, sum: 0 };

    console.log('createCounterInvoicesDone - Working on organization:', { id, ...organization });

    let transactionRunAttempt = 0;
    await firestore.runTransaction(async transaction => {
      transactionRunAttempt++;
      if (transactionRunAttempt > 1) {
        // if we will see too many "transactionRunAttempt" value in logs - that's a signal to rethink this function
        console.error('updateOrganizationCounter - transactionRunAttempt =', transactionRunAttempt);
      }
      transaction.create(counterRef, counterBody);
    });
    console.log('createCounterInvoicesDone - completed. Results:', {
      counterBody,
      counterPath,
    });
  } catch (error) {
    console.error('createCounterInvoicesDone', error);
    throw new Error(error);
  }
}
