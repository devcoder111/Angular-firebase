//locations
// get: user+ with perms by byLocations
// list: user+ with perms by byLocations
// create: owner of org
// update: owner of org
// delete: nobody

import * as firebase from 'firebase';
import { configureFirebase } from '../+utils/configureFirebase';
import { Location } from '../../../../../shared/types/location.interface';
import { CollectionNames } from '../../../../../shared/values/collectionNames.map';
import { DemoData } from '../../../../demo-data/firestore/backup';
import { AuthUsersArray } from '../../../../demo-data/authentication/users';
import { signIn, userId } from '../+utils/auth';
import { createId } from '../../../../functions/src/+utils/createId';
import { Organization } from '../../../../../shared/types/organization.interface';

describe('/locations/{id}', () => {
  const collectionName = CollectionNames.locations;
  const foreignUserId = AuthUsersArray.find(u => u.testTags && u.testTags.includes('ORGANIZATION2User2')).uid;

  beforeAll(() => {
    configureFirebase();
  });

  const location1Id = 'LOCATION1';
  const location1: Location = { ...DemoData[collectionName][location1Id], id: location1Id } as any;
  const location2Id = 'LOCATION2';
  const location2: Location = { ...DemoData[collectionName][location2Id], id: location2Id } as any;
  const organization2Id = 'ORGANIZATION2';
  const organization2: Organization = { ...DemoData[collectionName][organization2Id], id: organization2Id } as any;

  const locationForCreation: Location = {
    address: 'fakeString',
    name: 'Test location',
    code: 'fakeString',
    details: 'fakeString',
    organizationId: organization2.id,
    createdAt: new Date(),
    createdBy: null,
    isDeleted: false,
    availableForUsers: [],
  };

  describe('Anonymous', () => {
    beforeAll(() => {
      return firebase.auth().signOut();
    });

    it('GET is not allowed', async () => {
      try {
        await firebase
          .firestore()
          .doc(`${collectionName}/${location2.id}`)
          .get();
        throw new Error('Should fail');
      } catch (error) {
        expect(error.message).toMatch(/Missing or insufficient permissions/);
      }
      return;
    });

    it('LIST is not allowed', async () => {
      try {
        await firebase
          .firestore()
          .collection(collectionName)
          .limit(1)
          .get();
        throw new Error('Should fail');
      } catch (error) {
        expect(error.message).toMatch(/Missing or insufficient permissions/);
      }
      return;
    });

    it('CREATE is not allowed', async () => {
      try {
        await firebase
          .firestore()
          .collection(collectionName)
          .add(locationForCreation as any);
        throw new Error('Should fail');
      } catch (error) {
        expect(error.message).toMatch(/Missing or insufficient permissions/);
      }
      return;
    });

    it('UPDATE is not allowed', async () => {
      const updatedLocation: Partial<Location> = {
        name: 'Tokyo',
      };
      try {
        await firebase
          .firestore()
          .doc(`${collectionName}/${location2.id}`)
          .update(updatedLocation as any);
        throw new Error('Should fail');
      } catch (error) {
        expect(error.message).toMatch(/Missing or insufficient permissions/);
      }
      return;
    });

    it('DELETE is not allowed', async () => {
      try {
        await firebase
          .firestore()
          .doc(`${collectionName}/${location2.id}`)
          .delete();
        throw new Error('Should fail');
      } catch (error) {
        expect(error.message).toMatch(/Missing or insufficient permissions/);
      }
      return;
    });
  });

  describe('Authenticated user with "user" access to LOCATION2', () => {
    beforeAll(() => {
      return signIn(AuthUsersArray.find(u => u.testTags && u.testTags.indexOf('ORGANIZATION2User') !== -1));
    });

    describe('GET', () => {
      it('Can get his location', async () => {
        const documentSnapshot = await firebase
          .firestore()
          .doc(`${collectionName}/${location2.id}`)
          .get();
        expect(documentSnapshot).toBeTruthy();
        return;
      });

      it("Can't get foreign location", async () => {
        try {
          await firebase
            .firestore()
            .doc(`${collectionName}/${location1.id}`)
            .get();
          throw new Error('Should fail');
        } catch (error) {
          expect(error.message).toMatch(/Missing or insufficient permissions/);
        }
        return;
      });
    });

    describe('LIST', () => {
      it('With limit > 20 - fails', async () => {
        try {
          await firebase
            .firestore()
            .collection(collectionName)
            .where('availableForUsers', 'array-contains', userId())
            .limit(21)
            .get();
          throw new Error('Should fail');
        } catch (error) {
          expect(error.message).toMatch(/Missing or insufficient permissions/);
        }
        return;
      });

      it('Can get list of his location', async () => {
        const querySnapshot = await firebase
          .firestore()
          .collection(collectionName)
          .where('availableForUsers', 'array-contains', userId())
          .limit(1)
          .get();
        expect(querySnapshot.size).toBe(1);
        return;
      });

      it("Can't get list of foreign location", async () => {
        try {
          await firebase
            .firestore()
            .collection(collectionName)
            .where('availableForUsers', 'array-contains', foreignUserId)
            .limit(1)
            .get();
          throw new Error('Should fail');
        } catch (error) {
          expect(error.message).toMatch(/Missing or insufficient permissions/);
        }
        return;
      });
    });

    it('CREATE is not allowed', async () => {
      try {
        await firebase
          .firestore()
          .collection(collectionName)
          .add(locationForCreation as any);
        throw new Error('Should fail');
      } catch (error) {
        expect(error.message).toMatch(/Missing or insufficient permissions/);
      }
      return;
    });

    it('UPDATE is not allowed', async () => {
      const updatedLocation: Partial<Location> = {
        name: 'Tokyo 2',
      };
      try {
        await firebase
          .firestore()
          .doc(`${collectionName}/${location2.id}`)
          .update(updatedLocation as any);
        throw new Error('Should fail');
      } catch (error) {
        expect(error.message).toMatch(/Missing or insufficient permissions/);
      }
      return;
    });

    it('DELETE is not allowed', async () => {
      try {
        await firebase
          .firestore()
          .doc(`${collectionName}/${location2.id}`)
          .delete();
        throw new Error('Should fail');
      } catch (error) {
        expect(error.message).toMatch(/Missing or insufficient permissions/);
      }
      return;
    });
  });

  describe('Authenticated user with "admin" access to LOCATION2', () => {
    beforeAll(() => {
      return signIn(AuthUsersArray.find(u => u.testTags && u.testTags.includes('ORGANIZATION2Admin')));
    });

    describe('GET', () => {
      it('Can get his location', async () => {
        const documentSnapshot = await firebase
          .firestore()
          .doc(`${collectionName}/${location2.id}`)
          .get();
        expect(documentSnapshot).toBeTruthy();
        return;
      });

      it("Can't get foreign location", async () => {
        try {
          await firebase
            .firestore()
            .doc(`${collectionName}/${location1.id}`)
            .get();
          throw new Error('Should fail');
        } catch (error) {
          expect(error.message).toMatch(/Missing or insufficient permissions/);
        }
        return;
      });
    });

    describe('LIST', () => {
      it('With limit > 20 - fails', async () => {
        try {
          await firebase
            .firestore()
            .collection(collectionName)
            .where('availableForUsers', 'array-contains', userId())
            .limit(21)
            .get();
          throw new Error('Should fail');
        } catch (error) {
          expect(error.message).toMatch(/Missing or insufficient permissions/);
        }
        return;
      });

      it('Can get list of his location', async () => {
        const querySnapshot = await firebase
          .firestore()
          .collection(collectionName)
          .where('availableForUsers', 'array-contains', userId())
          .limit(1)
          .get();
        expect(querySnapshot.size).toBe(1);
        return;
      });

      it("Can't get list of foreign location", async () => {
        try {
          await firebase
            .firestore()
            .collection(collectionName)
            .where('availableForUsers', 'array-contains', foreignUserId)
            .limit(1)
            .get();
          throw new Error('Should fail');
        } catch (error) {
          expect(error.message).toMatch(/Missing or insufficient permissions/);
        }
        return;
      });
    });

    it('CREATE is not allowed', async () => {
      try {
        await firebase
          .firestore()
          .collection(collectionName)
          .add(locationForCreation as any);
        throw new Error('Should fail');
      } catch (error) {
        expect(error.message).toMatch(/Missing or insufficient permissions/);
      }
      return;
    });

    it('UPDATE is not allowed', async () => {
      const updatedLocation: Partial<Location> = {
        name: 'Tokyo 3',
      };
      try {
        await firebase
          .firestore()
          .doc(`${collectionName}/${location2.id}`)
          .update(updatedLocation as any);
        throw new Error('Should fail');
      } catch (error) {
        expect(error.message).toMatch(/Missing or insufficient permissions/);
      }
      return;
    });

    it('DELETE success', async () => {
      try {
        await firebase
          .firestore()
          .doc(`${collectionName}/${location2.id}`)
          .delete();
        throw new Error('Should fail');
      } catch (error) {
        expect(error.message).toMatch(/Missing or insufficient permissions/);
      }
      return;
    });
  });

  describe('Authenticated user with "owner" access to LOCATION2', () => {
    beforeAll(() => {
      return signIn(AuthUsersArray.find(u => u.testTags && u.testTags.indexOf('ORGANIZATION2Owner') !== -1));
    });

    describe('GET', () => {
      it('Can get his location', async () => {
        const documentSnapshot = await firebase
          .firestore()
          .doc(`${collectionName}/${location2.id}`)
          .get();
        expect(documentSnapshot).toBeTruthy();
        return;
      });

      it("Can't get foreign location", async () => {
        try {
          await firebase
            .firestore()
            .doc(`${collectionName}/${location1.id}`)
            .get();
          throw new Error('Should fail');
        } catch (error) {
          expect(error.message).toMatch(/Missing or insufficient permissions/);
        }
        return;
      });
    });

    describe('LIST', () => {
      it('With limit > 20 - fails', async () => {
        try {
          await firebase
            .firestore()
            .collection(collectionName)
            .where('availableForUsers', 'array-contains', userId())
            .limit(21)
            .get();
          throw new Error('Should fail');
        } catch (error) {
          expect(error.message).toMatch(/Missing or insufficient permissions/);
        }
        return;
      });

      it('Can get list of his location', async () => {
        const querySnapshot = await firebase
          .firestore()
          .collection(collectionName)
          .where('availableForUsers', 'array-contains', userId())
          .limit(1)
          .get();
        expect(querySnapshot.size).toBe(1);
        return;
      });

      it("Can't get list of foreign location", async () => {
        try {
          await firebase
            .firestore()
            .collection(collectionName)
            .where('availableForUsers', 'array-contains', foreignUserId)
            .limit(1)
            .get();
          throw new Error('Should fail');
        } catch (error) {
          expect(error.message).toMatch(/Missing or insufficient permissions/);
        }
        return;
      });
    });

    describe('CREATE', () => {
      const locationId = createId();
      beforeAll(() => {
        locationForCreation.availableForUsers = [userId()];
        locationForCreation.createdBy = userId();
      });

      it('CREATE succeed', async () => {
        await firebase
          .firestore()
          .collection(collectionName)
          .add(locationForCreation as any);
        setTimeout(async () => {
          const createdLocation = (await firebase
            .firestore()
            .doc(`${collectionName}/${locationId}`)
            .get()).data() as Location;
          expect(createdLocation.name).toBe('Test location');
          return;
        }, 6000);
      });

      afterAll(async () => {
        // await firebase.firestore().doc(`${collectionName}/${locationId}`).delete();
      });
    });

    describe('UPDATE', () => {
      it('UPDATE succeed', async () => {
        const updatedLocation: Partial<Location> = {
          name: 'Tokyo 4',
        };
        await firebase
          .firestore()
          .doc(`${collectionName}/${location2.id}`)
          .update(updatedLocation as any);
        const createdLocation = (await firebase
          .firestore()
          .doc(`${collectionName}/${location2.id}`)
          .get()).data() as Location;
        expect(createdLocation.name).toBe('Tokyo 4');
        expect(1).toBe(1);
        return;
      });

      afterAll(async () => {
        const updatedLocation: Partial<Location> = { name: 'Tokyo' };
        await firebase
          .firestore()
          .doc(`${collectionName}/${location2.id}`)
          .update(updatedLocation as any);
      });
      it("can't UPDATE from foreign organization", async () => {
        const updatedLocation: Partial<Location> = {
          name: 'Tokyo',
        };
        const locationFromForeignOrganization = 'LOCATION1';
        try {
          await firebase
            .firestore()
            .doc(`${collectionName}/${locationFromForeignOrganization}`)
            .update(updatedLocation as any);
          throw new Error('Should fail');
        } catch (error) {
          expect(error.message).toMatch(/Missing or insufficient permissions/);
        }
        return;
      });
    });

    it('DELETE is not allowed', async () => {
      try {
        await firebase
          .firestore()
          .doc(`${collectionName}/${location2.id}`)
          .delete();
        throw new Error('Should fail');
      } catch (error) {
        expect(error.message).toMatch(/Missing or insufficient permissions/);
      }
      return;
    });
  });

  afterAll(async () => {
    await firebase.app().delete();
  });
});
