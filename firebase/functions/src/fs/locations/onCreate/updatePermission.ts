import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import { getFirestore } from '../../../+utils/firestore';
import { Location } from '../../../../../../shared/types/location.interface';
import { CollectionNames } from '../../../../../../shared/values/collectionNames.map';
import { Permission } from '@shared/types/permission.interface';

const firestore = getFirestore();

export async function updatePermission(snapshot: DocumentSnapshot): Promise<void> {
  try {
    const id = snapshot.id;
    const location: Location = snapshot.data() as any;
    const permissionPath = `${CollectionNames.permissions}/${location.createdBy}_${location.organizationId}`;
    const permissionRef = firestore.doc(permissionPath);

    console.log('updatePermission - Working on location:', { id, ...location });

    let transactionRunAttempt = 0;
    await firestore.runTransaction(async transaction => {
      transactionRunAttempt++;
      if (transactionRunAttempt > 1) {
        // if we will see too many "transactionRunAttempt" value in logs - that's a signal to rethink this function
        console.error('updatePermission - transactionRunAttempt =', transactionRunAttempt);
      }
      const permissionSnapshot = await transaction.get(permissionRef);
      const permission = permissionSnapshot.data() as Permission;
      if (permission.byLocations.indexOf(id) === -1) {
        transaction.update(permissionRef, { byLocations: [...permission.byLocations, id] });
        console.log('updatePermission - updated');
      } else {
        console.log('updatePermission - update not necessary');
      }
    });
  } catch (error) {
    console.error('updatePermission', error);
    throw new Error(error);
  }
}
