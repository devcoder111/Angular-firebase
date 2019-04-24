import { FirebaseFirestore as Firestore } from '@firebase/firestore-types';

export type FirestoreBackupItemsMap = {
  [itemId: string]: {
    [field: string]: any;
  };
};
export type FirestoreBackup = {
  [collectionName: string]: FirestoreBackupItemsMap;
};

async function getCollectionItems(firestore: Firestore, collection: string): Promise<FirestoreBackup> {
  const querySnapshot = await firestore.collection(collection).get();
  const itemsMap = querySnapshot.docs.reduce((acc, doc) => {
    acc[doc.id] = doc.data();
    return acc;
  }, {});
  return { [collection]: itemsMap };
}

export async function exportFirestore(firestore: Firestore, collections: string[]): Promise<FirestoreBackup> {
  console.log('exportFirestore - backing up collections:', JSON.stringify(collections, null, 2));
  const promises = collections.map(async collection => {
    return getCollectionItems(firestore, collection);
  });
  const collectionsItems = await Promise.all(promises);
  const result = collectionsItems.reduce((acc, cur) => ({ ...acc, ...cur }), {});
  console.log('exportFirestore - backup complete');
  return result;
}
