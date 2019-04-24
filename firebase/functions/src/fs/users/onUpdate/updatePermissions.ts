import { Change } from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import { getFirestore } from '../../../+utils/firestore';
import { CollectionNames } from '../../../../../../shared/values/collectionNames.map';
import { User } from '@shared/types/user.interface';

const firestore = getFirestore();

/**
 * If user has changed - update permissions field fields
 * @param {Change<DocumentSnapshot>} change
 * @returns {Promise<void>}
 */
export async function updatePermissions(change: Change<DocumentSnapshot>): Promise<void> {
  try {
    const before: User = change.before.data() as any;
    const after: User = change.after.data() as any;
    const userId = change.after.id;

    console.log('updatePermissions - Working on user:', {
      id: userId,
      userBefore: before,
      userAfter: after,
    });

    let transactionRunAttempt = 0;
    await firestore.runTransaction(async transaction => {
      transactionRunAttempt++;
      if (transactionRunAttempt > 1) {
        // if we will see too many "transactionRunAttempt" value in logs - that's a signal to rethink this function
        console.error('updatePermissions - transactionRunAttempt =', transactionRunAttempt);
      }

      const permissionsSnapshot = await firestore
        .collection(`${CollectionNames.permissions}`)
        .where('userId', '==', userId)
        .get();
      const permissionIds = permissionsSnapshot.docs.map(doc => doc.id);

      for (const permissionId of permissionIds) {
        const permissionPath = `${CollectionNames.permissions}/${permissionId}`;
        const permissionRef = firestore.doc(permissionPath);
        const updatedPermission = {
          email: after.email,
          displayName: after.displayName || null,
          jobTitle: after.jobTitle || null,
        };
        transaction.update(permissionRef, updatedPermission);
      }

      console.log('updatePermissions - updated:', { permissionIds });
    });
  } catch (error) {
    console.error('updatePermissions', error);
    throw new Error(error);
  }
}
