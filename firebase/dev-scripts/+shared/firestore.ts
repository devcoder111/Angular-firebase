import { sleep } from '../../../shared/helpers/sleep/sleep.helper';
import { CollectionNames } from '../../../shared/values/collectionNames.map';
import { DataMap } from './types';

export interface DemoDataCollectionConfig {
  path: CollectionNames;
  dataMap?: DataMap<any>;
  delayMsAfterEachBatch?: number;
  delayMsBeforeImportCollection?: number;
  batchSize?: number;
}

export async function deleteFirestoreCollection(
  firestore: any,
  collectionPath: CollectionNames | string,
): Promise<void> {
  try {
    let i: number;
    while ((i = await deleteCollectionRecursive(firestore, collectionPath as string))) {
      console.log(`Firestore: ${i} documents deleted from "${collectionPath}"`);
    }
  } catch (error) {
    console.error(`deleteFirestoreCollection "${collectionPath}" error:`, error);
    process.exit(1);
  }
}

async function deleteCollectionRecursive(firestore: any, collectionPath: CollectionNames | string): Promise<number> {
  const batchSize = 100;
  const collectionRef = firestore.collection(collectionPath);
  const query = collectionRef.orderBy('__name__').limit(batchSize);
  const snapshot = await query.get();
  if (!snapshot.size) {
    return 0; // collection is empty;
  }
  // Delete documents in a batch
  const batch = firestore.batch();
  snapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });
  await batch.commit();
  return snapshot.size;
}

export async function createFirestoreCollection(firestore: any, config: DemoDataCollectionConfig): Promise<void> {
  if (!config.dataMap) {
    return; // nothing to create
  }
  try {
    const ids = Object.keys(config.dataMap);
    const batchSize = config.batchSize || 100;
    let pieceOfDataMap = getPieceOfDataMap(config.dataMap, 0, batchSize);
    let numOperated = Object.keys(pieceOfDataMap).length;
    let sizeOfNewPiece = numOperated;
    while (numOperated <= ids.length) {
      if (config.delayMsBeforeImportCollection) {
        await sleep(config.delayMsBeforeImportCollection);
      }
      await createCollectionRecursive(firestore, config.path as string, pieceOfDataMap, config.delayMsAfterEachBatch);
      console.log(`Firestore: ${sizeOfNewPiece} documents created in "${config.path}"`);
      pieceOfDataMap = getPieceOfDataMap(config.dataMap, numOperated, numOperated + batchSize);
      sizeOfNewPiece = Object.keys(pieceOfDataMap).length;
      numOperated += sizeOfNewPiece;
      if (!sizeOfNewPiece) {
        break;
      }
    }
  } catch (error) {
    console.error(`createFirestoreCollection "${config.path}" error:`, error);
    process.exit(1);
  }
}

async function createCollectionRecursive(
  firestore: any,
  collectionPath: string,
  pieceOfDataMap: DataMap<any>,
  delayMsAfterEachBatch: number,
): Promise<void> {
  const batch = firestore.batch();
  const ids = Object.keys(pieceOfDataMap);
  ids.forEach(id => batch.set(firestore.doc(`${collectionPath}/${id}`), pieceOfDataMap[id]));
  await batch.commit();
  if (delayMsAfterEachBatch) {
    await sleep(delayMsAfterEachBatch);
  }
  return;
}

function getPieceOfDataMap(dataMap: DataMap<any>, start: number, end: number): DataMap<any> {
  return Object.keys(dataMap)
    .slice(start, end)
    .reduce((acc, cur) => {
      acc[cur] = dataMap[cur];
      return acc;
    }, {});
}
