// permissions
//   get: 1) user - his only 2) adm/own - all in his org
//   list: adm/own - all in his org
//   create: 1) all if perm.org -> org.owner == him ?
//   update: 1) adm - all in his org, but a) cant update to owner, b) cant downgrade owners/admins, 2) owner all in
// his org, but downgrade himself
//   delete: 1) adm - all in his org except admins 2) owner -  all in his org except himself

import { configureFirebase } from '../+utils/configureFirebase';
import { CollectionNames } from '../../../../../shared/values/collectionNames.map';
import * as firebase from 'firebase';

describe('/permissions/{id}', () => {
  const collectionName = CollectionNames.permissions;

  beforeAll(() => {
    configureFirebase();
  });

  const permissionId = '00000010_ORGANIZATION1';

  describe('Anonymous', () => {
    beforeAll(() => {
      return firebase.auth().signOut();
    });

    it('GET is not allowed', async () => {
      try {
        await firebase
          .firestore()
          .doc(`${collectionName}/${permissionId}`)
          .get();
        throw new Error('Should fail');
      } catch (error) {
        expect(error.message).toMatch(/Missing or insufficient permissions/);
      }
      return;
    });
  });
});
