import { Change } from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import { getFirestore } from '../../../+utils/firestore';
import { CounterLocationInvoicesDone } from '../../../../../../shared/types/counterLocationInvoicesDone.interface';
import { Invoice } from '../../../../../../shared/types/invoice.interface';
import { CollectionNames } from '../../../../../../shared/values/collectionNames.map';
import { InvoiceStatuses } from '../../../../../../shared/values/invoiceStatuses.array';

const firestore = getFirestore();

export async function updateLocationCounter(change: Change<DocumentSnapshot>): Promise<void> {
  try {
    const before: Invoice = change.before.data() as any;
    const after: Invoice = change.after.data() as any;
    const invoiceId = change.after.id;

    const prevStatusIsDone = before.status === InvoiceStatuses.done.slug;
    const prevStatusIsNotDone = before.status !== InvoiceStatuses.done.slug;
    const prevIsDeleted = before.isDeleted === true;
    const prevIsNotDeleted = before.isDeleted !== true;

    const currentStatusIsDone = after.status === InvoiceStatuses.done.slug;
    const currentIsDeleted = after.isDeleted === true;
    const currentIsNotDeleted = after.isDeleted !== true;

    const changedToDone = prevStatusIsNotDone && currentStatusIsDone;
    const changedToDelete = prevStatusIsDone && prevIsNotDeleted && currentIsDeleted;
    const changedToRestore = prevStatusIsDone && prevIsDeleted && currentIsNotDeleted;

    if (!changedToDone && !changedToDelete && !changedToRestore) {
      return;
    }

    console.log('updateLocationCounter - Working on Invoice:', { id: invoiceId, ...after });

    const path = `${CollectionNames.countersLocationInvoicesDone}/${after.locationId}`;
    const invoicesCounterRef = firestore.doc(path);
    let invoicesCounterBefore = null;
    let invoicesCounterAfter = null;
    let transactionRunAttempt = 0;
    await firestore.runTransaction(async transaction => {
      transactionRunAttempt++;
      if (transactionRunAttempt > 1) {
        // if we will see too many "transactionRunAttempt" value in logs - that's a signal to rethink this function
        console.error('updateLocationCounter - transactionRunAttempt =', transactionRunAttempt);
      }
      const invoicesCounterSnapshot = await transaction.get(invoicesCounterRef);
      const invoicesCounter = invoicesCounterSnapshot.data() as CounterLocationInvoicesDone;
      invoicesCounterBefore = { ...invoicesCounter };
      if (changedToDone || changedToRestore) {
        invoicesCounter.amount++;
        invoicesCounter.sum += after.total;
      } else if (changedToDelete) {
        invoicesCounter.amount--;
        invoicesCounter.sum -= after.total;
      }

      invoicesCounterAfter = { ...invoicesCounter };
      return transaction.set(invoicesCounterRef, invoicesCounter);
    });
    console.log('updateLocationCounter - completed. Results:', {
      invoiceId,
      invoicesCounterBefore,
      invoicesCounterAfter,
    });
  } catch (error) {
    console.error('updateLocationCounter', error);
    throw new Error(error);
  }
}
