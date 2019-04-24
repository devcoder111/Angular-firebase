import * as admin from 'firebase-admin';

export function getFirebaseAdmin() {
  if (!admin.apps.length) {
    admin.initializeApp();
    admin.firestore().settings({ timestampsInSnapshots: true });
  }
  return admin;
}
