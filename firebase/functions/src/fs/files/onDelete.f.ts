import * as functions from 'firebase-functions';
import { CollectionNames } from '../../../../../shared/values/collectionNames.map';
import { deleteFileFromCloudStorage } from './onDelete/deleteFileFromCloudStorage';

exports = module.exports = functions.firestore.document(`${CollectionNames.files}/{id}`).onDelete(async change => {
  try {
    await Promise.all([deleteFileFromCloudStorage(change)]);
  } catch (error) {
    console.error('fsFilesOnDelete', error);
  }
});
