import { getFirebaseAdmin } from './admin';

const fbAdmin = getFirebaseAdmin();

export function getFirestore() {
  return fbAdmin.firestore();
}
