import * as firebase from 'firebase';
import { configureFirebase } from '../+utils/configureFirebase';
import { findOne } from '../+utils/findOne';
import { Order } from '../../../../../shared/types/order.interface';
import { OrganizationSupplier } from '../../../../../shared/types/organizationSupplier.interface';
import { CollectionNames } from '../../../../../shared/values/collectionNames.map';
import { OrderStatuses } from '../../../../../shared/values/orderStatuses.array';
import { AuthUsersArray } from '../../../../demo-data/authentication/users';
import { DemoData } from '../../../../demo-data/firestore/backup';
import { Organization } from '../../../../../shared/types/organization.interface';

describe('/orders/{id}', () => {
  const collectionName = CollectionNames.orders;

  beforeAll(() => {
    configureFirebase();
  });

  const orderFromOrganization1: Order = findOne(DemoData[collectionName], { organizationId: 'ORGANIZATION1' });
  const orderFromOrganization1statusDraft: Order = findOne(DemoData[collectionName], {
    organizationId: 'ORGANIZATION1',
    status: OrderStatuses.draft.slug,
  });
  const orderFromOrganization2: Organization = findOne(DemoData[collectionName], { organizationId: 'ORGANIZATION2' });
  // const orderFromLocation1: Location = findOne(DemoData[collectionName], { locationId: 'LOCATION1' });
  // const orderFromLocation2: Location = findOne(DemoData[collectionName], { locationId: 'LOCATION2' });
  const supplierFromOrganization1 = findOne<OrganizationSupplier>(DemoData.suppliers, {
    organizationId: 'ORGANIZATION1',
  });
  const orderForCreation: Order = {
    number: null,
    organizationId: 'ORGANIZATION1',
    locationId: 'LOCATION1',
    supplierId: supplierFromOrganization1.id,
    supplierName: supplierFromOrganization1.name,
    supplierIsGSTRegistered: supplierFromOrganization1.isGSTRegistered,
    otherInstructions: 'Something',
    deliveryDate: new Date(),
    subtotal: 0,
    taxes: 0,
    total: 0,
    status: OrderStatuses.draft.slug,
    isDeleted: false,
    publicPage: {
      openedAt: null,
      html: {
        url: null,
        fileId: null,
      },
      pdf: {
        url: null,
        fileId: null,
      },
    },
    voidReason: null,
    recentOrderNumber: null,
    recentOrderId: null,
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
          .doc(`${collectionName}/${orderFromOrganization1.id}`)
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
          .add(orderForCreation as any);
        throw new Error('Should fail');
      } catch (error) {
        expect(error.message).toMatch(/Missing or insufficient permissions/);
      }
      return;
    });
    it('UPDATE is not allowed', async () => {
      const updatedOrder: Partial<Order> = {
        otherInstructions: 'qwe',
      };
      try {
        await firebase
          .firestore()
          .doc(`${collectionName}/${orderFromOrganization1statusDraft.id}`)
          .update(updatedOrder as any);
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
          .doc(`${collectionName}/${orderFromOrganization1.id}`)
          .delete();
        throw new Error('Should fail');
      } catch (error) {
        expect(error.message).toMatch(/Missing or insufficient permissions/);
      }
      return;
    });
  });

  describe('Authenticated user with "admin" access to ORGANIZATION1 and LOCATION1', () => {
    const organization1 = 'ORGANIZATION1';
    const organization2 = 'ORGANIZATION2';
    const location1 = 'LOCATION1';
    const location2 = 'LOCATION2';
    const testUser = AuthUsersArray.find(u => u.testTags && u.testTags.indexOf('ORGANIZATION1Admin') !== -1);
    beforeAll(() => {
      return firebase.auth().signInWithEmailAndPassword(testUser.email, testUser.password);
    });

    describe('GET', () => {
      it('Order of ORGANIZATION1 successful', async () => {
        const documentSnapshot = await firebase
          .firestore()
          .doc(`${collectionName}/${orderFromOrganization1.id}`)
          .get();
        expect(documentSnapshot).toBeTruthy();
        return;
      });

      it('Order of ORGANIZATION2 fails', async () => {
        try {
          await firebase
            .firestore()
            .doc(`${collectionName}/${orderFromOrganization2.id}`)
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
            .where('organizationId', '==', organization1)
            .limit(21)
            .get();
          throw new Error('Should fail');
        } catch (error) {
          expect(error.message).toMatch(/Missing or insufficient permissions/);
        }
        return;
      });
      describe('Organization level', () => {
        it('Orders of ORGANIZATION1 successful', async () => {
          const querySnapshot = await firebase
            .firestore()
            .collection(collectionName)
            .where('organizationId', '==', organization1)
            .limit(1)
            .get();
          expect(querySnapshot.size).toBe(1);
          return;
        });

        it('Orders of ORGANIZATION2 fails', async () => {
          try {
            await firebase
              .firestore()
              .collection(collectionName)
              .where('organizationId', '==', organization2)
              .limit(1)
              .get();
            throw new Error('Should fail');
          } catch (error) {
            expect(error.message).toMatch(/Missing or insufficient permissions/);
          }
          return;
        });
      });

      describe('Location level', () => {
        it('Orders of LOCATION1 successful', async () => {
          const querySnapshot = await firebase
            .firestore()
            .collection(collectionName)
            .where('organizationId', '==', organization1)
            .where('locationId', '==', location1)
            .limit(1)
            .get();
          expect(querySnapshot.size).toBe(1);
          return;
        });

        it('Orders of LOCATION2 fails', async () => {
          try {
            await firebase
              .firestore()
              .collection(collectionName)
              .where('organizationId', '==', organization2)
              .where('locationId', '==', location2)
              .limit(1)
              .get();
            throw new Error('Should fail');
          } catch (error) {
            expect(error.message).toMatch(/Missing or insufficient permissions/);
          }
          return;
        });
      });
    });

    describe('CREATE', () => {
      beforeAll(() => {
        orderForCreation.createdBy = firebase.auth().currentUser.uid;
      });

      it('Order in ORGANIZATION1 succeed', async () => {
        const createdOrder = await firebase
          .firestore()
          .collection(collectionName)
          .add(orderForCreation as any);
        expect(createdOrder.id).toBeTruthy();
        return;
      });

      // TODO: add more test cases with not valid order (missing fields, invalid supplier, organization/location, etc)
    });

    describe('UPDATE', () => {
      it('Order in ORGANIZATION1 succeed', async () => {
        const updatedOrder: Partial<Order> = {
          otherInstructions: 'qwe',
        };
        const id = orderFromOrganization1statusDraft.id;
        await firebase
          .firestore()
          .doc(`${collectionName}/${id}`)
          .set(updatedOrder as any, { merge: true });
        expect('no error').toBeTruthy();
        return;
      });

      // TODO: add more test cases with not valid order (missing fields, invalid supplier, organization/location, etc)
    });

    describe('DELETE', () => {
      it('is not allowed', async () => {
        try {
          await firebase
            .firestore()
            .doc(`${collectionName}/${orderFromOrganization1.id}`)
            .delete();
          throw new Error('Should fail');
        } catch (error) {
          expect(error.message).toMatch(/Missing or insufficient permissions/);
        }
        return;
      });
    });
  });
});

// TODO: Authenticated user with "user" access to ORGANIZATION2 and LOCATION2

// TODO: Authenticated user with "user" access to ORGANIZATION2 and LOCATION2, LOCATION3

// TODO: Authenticated user with "user" access to ORGANIZATION1, ORGANIZATION2 and LOCATION1, LOCATION2, LOCATION3
