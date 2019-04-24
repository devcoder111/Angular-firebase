import { Change } from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import { getFirestore } from '../../../+utils/firestore';
import { Location } from '../../../../../../shared/types/location.interface';
import { CollectionNames } from '../../../../../../shared/values/collectionNames.map';

const firestore = getFirestore();

/**
 * If location.code has changed - update orderNumber counter "locationCode" field
 * @param {Change<DocumentSnapshot>} change
 * @returns {Promise<void>}
 */
export async function updateCounterOrderNumber(change: Change<DocumentSnapshot>): Promise<void> {
  try {
    const before: Location = change.before.data() as any;
    const after: Location = change.after.data() as any;
    const locationId = change.after.id;
    const rightCondition = before.code !== after.code; // was code changed?
    if (!rightCondition) {
      return;
    }

    console.log('updateCounterOrderNumber - Working on location:', {
      id: locationId,
      codeBefore: before.code,
      codeAfter: after.code,
    });

    const pathToCounter = `${CollectionNames.countersLocationOrderNumber}/${locationId}`;
    await firestore.doc(pathToCounter).update({ locationCode: after.code });
    console.log('updateCounterOrderNumber - Completed.', {
      locationId,
      codeBefore: before.code,
      codeAfter: after.code,
    });
  } catch (error) {
    console.error('updateCounterOrderNumber', { change }, error);
    throw new Error(error);
  }
}
