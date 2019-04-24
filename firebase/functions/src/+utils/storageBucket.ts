import { getFirebaseAdmin } from './admin';
import { getConfig } from './config';

const admin = getFirebaseAdmin();
const storage = admin.storage();
const bucketName = getConfig().storageBucketWithGSprefix;
const bucket = storage.bucket(bucketName);

export function getStorageBucket() {
  return bucket;
}
