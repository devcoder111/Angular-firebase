import * as admin from 'firebase-admin';
import { sleep } from '../../../../shared/helpers/sleep/sleep.helper';
import { AuthUsersArray } from '../../../demo-data/authentication/users';

export async function deleteUsersFromFirebaseAuthentication(nextPageToken?: any): Promise<void> {
  try {
    // List batch of users, 10 at a time.
    const result = await admin.auth().listUsers(10, nextPageToken);
    if (result.users.length) {
      const promises = result.users.map(u => admin.auth().deleteUser(u.uid));
      await Promise.all(promises);
      console.log(`Authentication: ${result.users.length} user(s) deleted.`);
    }
    if (result.pageToken) {
      await sleep(1000); // Firebase Authentication has limit of deletion	10 accounts/second
      // List next batch of users.
      await deleteUsersFromFirebaseAuthentication(result.pageToken);
    }
  } catch (error) {
    console.error('deleteUsersFromFirebaseAuthentication error:', error);
    process.exit(1);
  }
}

export async function createUsersInFirebaseAuthentication(): Promise<void> {
  try {
    await Promise.all(AuthUsersArray.map(u => admin.auth().createUser(u)));
    console.log(
      `Authentication: ${
        AuthUsersArray.length
      } user(s) created. Users documents in Firestore should be created by Cloud Function.`,
    );
  } catch (error) {
    console.error('createUsersInFirebaseAuthentication error:', error);
    process.exit(1);
  }
}
