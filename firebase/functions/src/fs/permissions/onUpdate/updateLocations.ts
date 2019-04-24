import { Change } from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import { getFirestore } from '../../../+utils/firestore';
import { CollectionNames } from '../../../../../../shared/values/collectionNames.map';
import { Permission } from '@shared/types/permission.interface';
import { without } from '../../../../../../shared/helpers/without/without.helper';
import { arraysEquals } from '../../../../../../shared/helpers/arraysEquals/arraysEquals.helper';

const firestore = getFirestore();

/**
 * If permissions has changed - update location.availableForUsers field
 * @param {Change<DocumentSnapshot>} change
 * @returns {Promise<void>}
 */
export async function updateLocations(change: Change<DocumentSnapshot>): Promise<void> {
  try {
    const before: Permission = change.before.data() as any;
    const after: Permission = change.after.data() as any;
    const rightCondition = !arraysEquals(before.byLocations, after.byLocations); // was `byLocations` changed?
    if (!rightCondition) {
      return;
    }

    console.log('updateLocations - Source permission:', { id: change.before.id });

    let transactionRunAttempt = 0;
    let updatedLocationIds = [];
    await firestore.runTransaction(async transaction => {
      transactionRunAttempt++;
      if (transactionRunAttempt > 1) {
        // if we will see too many "transactionRunAttempt" value in logs - that's a signal to rethink this function
        console.error('updateLocations - transactionRunAttempt =', transactionRunAttempt);
      }
      for (const oldLocationId of before.byLocations) {
        if (after.byLocations.indexOf(oldLocationId) === -1) {
          updatedLocationIds = [...updatedLocationIds, oldLocationId];
          const locationRef = firestore.doc(`${CollectionNames.locations}/${oldLocationId}`);
          const availableForUsers = (await locationRef.get()).data().availableForUsers;
          transaction.update(locationRef, { availableForUsers: without(availableForUsers, before.userId) });
        }
      }
      for (const newLocationId of after.byLocations) {
        if (before.byLocations.indexOf(newLocationId) === -1) {
          updatedLocationIds = [...updatedLocationIds, newLocationId];
          const locationRef = firestore.doc(`${CollectionNames.locations}/${newLocationId}`);
          const availableForUsers = (await locationRef.get()).data().availableForUsers;
          transaction.update(locationRef, { availableForUsers: [...availableForUsers, before.userId] });
        }
      }
    });
    console.log('updateLocation - updated.', { locationIds: updatedLocationIds });
  } catch (error) {
    console.error('updateLocation', { change }, error);
    throw new Error(error);
  }
}
