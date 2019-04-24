//organizations
// get: user+ with perms
// list: user+ with perms
// create: all
// update: owner
// delete: nobody

import * as firebase from 'firebase';
import { configureFirebase } from '../+utils/configureFirebase';
import { Organization } from '../../../../../shared/types/organization.interface';
import { CollectionNames } from '../../../../../shared/values/collectionNames.map';
import { DemoData } from '../../../../demo-data/firestore/backup';
import { AuthUsersArray } from '../../../../demo-data/authentication/users';
import { signIn, userId } from '../+utils/auth';
import { Roles } from '../../../../../shared/values/roles.array';
import { createId } from '../../../../functions/src/+utils/createId';

describe('/organizations/{id}', () => {
  const collectionName = CollectionNames.organizations;
  const foreignUserId = AuthUsersArray.find(u => u.testTags && u.testTags.includes('ORGANIZATION1Admin')).uid;

  beforeAll(() => {
    configureFirebase();
  });

  const organization1Id = 'ORGANIZATION1';
  const organization1: Organization = { ...DemoData[collectionName][organization1Id], id: organization1Id } as any;
  const organization2Id = 'ORGANIZATION2';
  const organization2: Organization = { ...DemoData[collectionName][organization2Id], id: organization2Id } as any;
  const organizationForCreation: Organization = {
    name: 'Test organization',
    details: 'Fake details',
    ownerId: null,
    admins: [],
    availableForUsers: [],
    timezone: 'Singapore',
    isDeleted: false,
    createdAt: new Date(),
    createdBy: null,
  };

  describe('Anonymous', () => {
    beforeAll(() => {
      return firebase.auth().signOut();
    });

    it('GET is not allowed', async () => {
      try {
        await firebase
          .firestore()
          .doc(`${collectionName}/${organization2.id}`)
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
          .add(organizationForCreation as any);
        throw new Error('Should fail');
      } catch (error) {
        expect(error.message).toMatch(/Missing or insufficient permissions/);
      }
      return;
    });

    it('UPDATE is not allowed', async () => {
      const updatedOrganization: Partial<Organization> = {
        details: 'qwe',
      };
      try {
        await firebase
          .firestore()
          .doc(`${collectionName}/${organization2.id}`)
          .update(updatedOrganization as any);
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
          .doc(`${collectionName}/${organization2.id}`)
          .delete();
        throw new Error('Should fail');
      } catch (error) {
        expect(error.message).toMatch(/Missing or insufficient permissions/);
      }
      return;
    });
  });

  describe('Authenticated user with "user" access to ORGANIZATION2', () => {
    beforeAll(() => {
      return signIn(AuthUsersArray.find(u => u.testTags && u.testTags.indexOf('ORGANIZATION2User') !== -1));
    });

    describe('GET', () => {
      it('Can get his organization', async () => {
        const documentSnapshot = await firebase
          .firestore()
          .doc(`${collectionName}/${organization2.id}`)
          .get();
        expect(documentSnapshot).toBeTruthy();
        return;
      });

      it("Can't get foreign organization", async () => {
        try {
          await firebase
            .firestore()
            .doc(`${collectionName}/${organization1.id}`)
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

      it('Can get list of his organization', async () => {
        const querySnapshot = await firebase
          .firestore()
          .collection(collectionName)
          .where('availableForUsers', 'array-contains', userId())
          .limit(1)
          .get();
        expect(querySnapshot.size).toBe(1);
        return;
      });

      it("Can't get list of foreign organization", async () => {
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
      let organizationId;
      let permissionId;

      beforeAll(() => {
        organizationId = createId();
        permissionId = `${userId()}_${organizationId}`;
        organizationForCreation.ownerId = userId();
        organizationForCreation.admins = [userId()];
        organizationForCreation.availableForUsers = [userId()];
        organizationForCreation.createdBy = userId();
      });

      it('CREATE succeed', async () => {
        const organizationPath = `${collectionName}/${organizationId}`;
        const organizationRef = firebase.firestore().doc(organizationPath);
        const permissionPath = `${CollectionNames.permissions}/${permissionId}`;
        const permissionRef = firebase.firestore().doc(permissionPath);
        const permission = {
          userId: userId(),
          displayName: 'fakeString',
          jobTitle: null,
          email: 'fakeString',
          organizationId,
          role: Roles.owner.slug,
          byLocations: [],
          invitedAt: new Date(),
          invitedBy: userId(),
        };
        const batch = firebase.firestore().batch();
        batch.set(organizationRef, organizationForCreation);
        batch.set(permissionRef, permission);
        await batch.commit();
        const createdOrganization = (await firebase
          .firestore()
          .doc(`${collectionName}/${organizationId}`)
          .get()).data() as Organization;
        expect(createdOrganization.name).toBe('Test organization');
        expect(1).toBe(1);
        return;
      });

      afterAll(async () => {
        // await firebase.firestore().doc(`${collectionName}/${organizationId}`).delete();
        // await firebase.firestore().doc(`${CollectionNames.permissions}/${permissionId}`).delete();
      });
    });

    it('UPDATE success', async () => {
      const updatedOrganization: Partial<Organization> = {
        name: 'Tokyo Groups 1',
      };
      try {
        await firebase
          .firestore()
          .doc(`${collectionName}/${organization2.id}`)
          .update(updatedOrganization as any);
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
          .doc(`${collectionName}/${organization2.id}`)
          .delete();
        throw new Error('Should fail');
      } catch (error) {
        expect(error.message).toMatch(/Missing or insufficient permissions/);
      }
      return;
    });
  });

  describe('Authenticated user with "admin" access to ORGANIZATION2', () => {
    beforeAll(() => {
      return signIn(AuthUsersArray.find(u => u.testTags && u.testTags.includes('ORGANIZATION2Admin')));
    });

    describe('GET', () => {
      it('Can get his organization', async () => {
        const documentSnapshot = await firebase
          .firestore()
          .doc(`${collectionName}/${organization2.id}`)
          .get();
        expect(documentSnapshot).toBeTruthy();
        return;
      });

      it("Can't get foreign organization", async () => {
        try {
          await firebase
            .firestore()
            .doc(`${collectionName}/${organization1.id}`)
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

      it('Can get list of his organization', async () => {
        const querySnapshot = await firebase
          .firestore()
          .collection(collectionName)
          .where('availableForUsers', 'array-contains', userId())
          .limit(1)
          .get();
        expect(querySnapshot.size).toBe(1);
        return;
      });

      it("Can't get list of foreign organization", async () => {
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
      beforeAll(() => {
        organizationForCreation.ownerId = userId();
        organizationForCreation.admins = [userId()];
        organizationForCreation.availableForUsers = [userId()];
        organizationForCreation.createdBy = userId();
      });

      it('CREATE succeed', async () => {
        const organizationId = createId();
        const organizationPath = `${CollectionNames.organizations}/${organizationId}`;
        const organizationRef = firebase.firestore().doc(organizationPath);
        const permissionPath = `${CollectionNames.permissions}/${userId()}_${organizationId}`;
        const permissionRef = firebase.firestore().doc(permissionPath);
        const permission = {
          userId: userId(),
          displayName: 'fakeString',
          jobTitle: null,
          email: 'fakeString',
          organizationId,
          role: Roles.owner.slug,
          byLocations: [],
          invitedAt: new Date(),
          invitedBy: userId(),
        };
        const batch = firebase.firestore().batch();
        batch.set(organizationRef, organizationForCreation);
        batch.set(permissionRef, permission);
        await batch.commit();
        const createdOrganization = (await firebase
          .firestore()
          .doc(`${collectionName}/${organizationId}`)
          .get()).data() as Organization;
        expect(createdOrganization.name).toBe('Test organization');
        expect(1).toBe(1);
        return;
      });
    });

    it('UPDATE success', async () => {
      const updatedOrganization: Partial<Organization> = {
        name: 'Tokyo Groups 1',
      };
      try {
        await firebase
          .firestore()
          .doc(`${collectionName}/${organization2.id}`)
          .update(updatedOrganization as any);
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
          .doc(`${collectionName}/${organization2.id}`)
          .delete();
        throw new Error('Should fail');
      } catch (error) {
        expect(error.message).toMatch(/Missing or insufficient permissions/);
      }
      return;
    });
  });

  describe('Authenticated user with "owner" access to ORGANIZATION2', () => {
    beforeAll(() => {
      return signIn(AuthUsersArray.find(u => u.testTags && u.testTags.indexOf('ORGANIZATION2Owner') !== -1));
    });

    describe('GET', () => {
      it('Can get his organization', async () => {
        const documentSnapshot = await firebase
          .firestore()
          .doc(`${collectionName}/${organization2.id}`)
          .get();
        expect(documentSnapshot).toBeTruthy();
        return;
      });

      it("Can't get foreign organization", async () => {
        try {
          await firebase
            .firestore()
            .doc(`${collectionName}/${organization1.id}`)
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

      it('Can get list of his organization', async () => {
        const querySnapshot = await firebase
          .firestore()
          .collection(collectionName)
          .where('availableForUsers', 'array-contains', userId())
          .limit(1)
          .get();
        expect(querySnapshot.size).toBe(1);
        return;
      });

      it("Can't get list of foreign organization", async () => {
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
      beforeAll(() => {
        organizationForCreation.ownerId = userId();
        organizationForCreation.admins = [userId()];
        organizationForCreation.availableForUsers = [userId()];
        organizationForCreation.createdBy = userId();
      });

      it('CREATE succeed', async () => {
        const organizationId = createId();
        const organizationPath = `${CollectionNames.organizations}/${organizationId}`;
        const organizationRef = firebase.firestore().doc(organizationPath);
        const permissionPath = `${CollectionNames.permissions}/${userId()}_${organizationId}`;
        const permissionRef = firebase.firestore().doc(permissionPath);
        const permission = {
          userId: userId(),
          displayName: 'fakeString',
          jobTitle: null,
          email: 'fakeString',
          organizationId,
          role: Roles.owner.slug,
          byLocations: [],
          invitedAt: new Date(),
          invitedBy: userId(),
        };
        const batch = firebase.firestore().batch();
        batch.set(organizationRef, organizationForCreation);
        batch.set(permissionRef, permission);
        await batch.commit();
        const createdOrganization = (await firebase
          .firestore()
          .doc(`${collectionName}/${organizationId}`)
          .get()).data() as Organization;
        expect(createdOrganization.name).toBe('Test organization');
        expect(1).toBe(1);
        return;
      });
    });

    describe('UPDATE', () => {
      it('UPDATE succeed', async () => {
        const updatedOrganization: Partial<Organization> = {
          name: 'Tokyo Groups 4',
        };
        await firebase
          .firestore()
          .doc(`${collectionName}/${organization2.id}`)
          .update(updatedOrganization as any);
        const createdOrganization = (await firebase
          .firestore()
          .doc(`${collectionName}/${organization2.id}`)
          .get()).data() as Organization;
        expect(createdOrganization.name).toBe('Tokyo Groups 4');
        expect(1).toBe(1);
        return;
      });

      afterAll(async () => {
        const updatedOrganization: Partial<Organization> = { name: 'Tokyo Groups' };
        await firebase
          .firestore()
          .doc(`${collectionName}/${organization2.id}`)
          .update(updatedOrganization as any);
      });
    });

    it('DELETE is not allowed', async () => {
      try {
        await firebase
          .firestore()
          .doc(`${collectionName}/${organization2.id}`)
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
