import { FirebaseFirestore as Firestore } from '@firebase/firestore-types';
import { FirestoreBackup, FirestoreBackupItemsMap } from './export';

async function setCollectionItems(
  firestore: Firestore,
  collection: string,
  itemsMap: FirestoreBackupItemsMap,
): Promise<void[]> {
  const setItem = (id: string, body: any): Promise<void> =>
    firestore
      .collection(collection)
      .doc(id)
      .set(body);
  const promises = Object.keys(itemsMap).map(itemId => setItem(itemId, itemsMap[itemId]));
  return Promise.all(promises);
}

export async function importFirestore(firestore: Firestore, backup: FirestoreBackup): Promise<void> {
  console.log('importFirestore - restoring backup');
  const promises = Object.keys(backup).map(async collection => {
    return setCollectionItems(firestore, collection, backup[collection]);
  });
  await Promise.all(promises);
  console.log('importFirestore - backup was restored');
  return;
}
