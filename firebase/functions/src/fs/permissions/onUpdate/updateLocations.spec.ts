import { AuthUsersArray } from '../../../../../demo-data/authentication/users';
import { Location } from '../../../../../../shared/types/location.interface';
import { CollectionNames } from '../../../../../../shared/values/collectionNames.map';
import { DemoData } from '../../../../../demo-data/firestore/backup';
import { signIn } from '../../../../../firestore/rules/src/+utils/auth';
import { Permission } from '@shared/types/permission.interface';
import firebase = require('../../../../../firestore/rules/node_modules/firebase');
import { configureFirebase } from '../../../../../firestore/rules/src/+utils/configureFirebase';

describe('firebase function', () => {
  describe('fs', () => {
    describe('permissions', () => {
      beforeAll(async () => {
        configureFirebase();
      });
      describe('onUpdate', () => {
        beforeAll(async () => {
          return signIn(AuthUsersArray.find(u => u.testTags && u.testTags.includes('ORGANIZATION2Owner')));
        });

        describe('updateLocations', () => {
          const collectionName = CollectionNames.permissions;
          const location3Id = 'LOCATION3';
          const location3: Location = { ...DemoData[CollectionNames.locations][location3Id], id: location3Id };
          const user11 = AuthUsersArray.find(u => u.testTags && u.testTags.includes('ORGANIZATION2User'));
          const permissionU11O2Id = `${user11.uid}_${location3.organizationId}`;
          const permissionU11O2: Permission = { ...DemoData[collectionName][permissionU11O2Id], id: permissionU11O2Id };
          let permissionRef;

          beforeAll(async () => {
            permissionRef = firebase.firestore().doc(`${collectionName}/${permissionU11O2Id}`);
          });

          it('must add userId in `location.availableForUsers`', async () => {
            await permissionRef.update({ byLocation: [...permissionU11O2.byLocations, location3Id] });

            const locationsRef = firebase.firestore().doc(`${CollectionNames.locations}/${location3Id}`);
            setTimeout(async () => {
              const availableForUsers = (await locationsRef.get()).data().availableForUsers;
              console.log(`availableForUsers: ${JSON.stringify(availableForUsers)}`);
              console.log(`newUser.uid: ${JSON.stringify(user11.uid)}`);
              expect(availableForUsers).toContain(user11.uid);
            }, 500);
          });

          afterAll(async () => {
            await permissionRef.update({ byLocation: permissionU11O2.byLocations });
            await firebase.app().delete();
          });
        });
      });
    });
  });
});
