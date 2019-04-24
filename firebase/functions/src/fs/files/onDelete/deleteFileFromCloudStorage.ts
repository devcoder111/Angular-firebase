import { getStorageBucket } from '../../../+utils/storageBucket';
const bucket = getStorageBucket();

export async function deleteFileFromCloudStorage(change) {
  try {
    const fileData = change.data();
    const filePath = fileData.path;
    console.log('deleteFileFromCloudStorage - Working on File:', { fileData });
    await bucket.file(filePath).delete();
    console.log('deleteFileFromCloudStorage - completed.');
  } catch (error) {
    console.error('deleteFileFromCloudStorage', error);
    throw new Error(error);
  }
}
