import { AuthUsersArray } from '../../../../../demo-data/authentication/users';
import { configureFirebase } from '../../../../../firestore/rules/src/+utils/configureFirebase';
import { Location } from '../../../../../../shared/types/location.interface';
import { CollectionNames } from '../../../../../../shared/values/collectionNames.map';
import { signIn, userId } from '../../../../../firestore/rules/src/+utils/auth';
import firebase = require('../../../../../firestore/rules/node_modules/firebase');

describe('firebase function', () => {
  describe('fs', () => {
    describe('locations', () => {
      beforeAll(() => {
        configureFirebase();
      });

      describe('onCreate', () => {
        beforeAll(async () => {
          return signIn(AuthUsersArray.find(u => u.testTags && u.testTags.includes('ORGANIZATION2Owner')));
        });

        describe('updatePermission', () => {
          const collectionName = CollectionNames.locations;
          let permissionRef, locationForCreation: Location, createdLocationId, oldByLocations;
          const organizationId = 'ORGANIZATION2';
          locationForCreation = {
            address: 'fakeString',
            name: 'fakeString',
            code: 'fakeString',
            details: 'fakeString',
            organizationId: organizationId,
            createdAt: new Date(),
            createdBy: null,
            isDeleted: false,
            availableForUsers: [],
          };

          beforeAll(async () => {
            locationForCreation.availableForUsers = [userId()];
            locationForCreation.createdBy = userId();
            permissionRef = firebase.firestore().doc(`${CollectionNames.permissions}/${userId()}_${organizationId}`);
            oldByLocations = (await permissionRef.get()).data().byLocations;
          });

          it('must add `locationId` in `permission.byLocation`', async () => {
            const createdLocation = await firebase
              .firestore()
              .collection(collectionName)
              .add(locationForCreation as any);
            createdLocationId = createdLocation.id;
            expect(createdLocationId).toBeTruthy();

            setTimeout(async () => {
              const permissionSnapshot = await permissionRef.get();
              expect(permissionSnapshot.id).toBeTruthy();
              expect(permissionSnapshot.data().byLocations).toContain(createdLocation.id);
            }, 500);
          });

          afterAll(async () => {
            await firebase
              .firestore()
              .doc(`${collectionName}/${createdLocationId}`)
              .delete();
            await permissionRef.update({ byLocations: oldByLocations });
            await firebase.app().delete();
          });
        });
      });
    });
  });
});
