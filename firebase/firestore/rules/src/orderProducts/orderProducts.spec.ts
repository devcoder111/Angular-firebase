import * as firebase from 'firebase';
import { configureFirebase } from '../+utils/configureFirebase';
import { findOne } from '../+utils/findOne';
import { OrderProduct } from '../../../../../shared/types/orderProduct.interface';
import { CollectionNames } from '../../../../../shared/values/collectionNames.map';
import { DemoData } from '../../../../demo-data/firestore/backup';
import { Order } from '../../../../../shared/types/order.interface';

describe('/orderProducts/{id}', () => {
  const collectionName = CollectionNames.orderProducts;

  beforeAll(() => {
    configureFirebase();
  });

  const orderProductFromOrganization1: OrderProduct = findOne(DemoData[collectionName], {
    organizationId: 'ORGANIZATION1',
  });

  describe('Anonymous', () => {
    beforeAll(() => {
      return firebase.auth().signOut();
    });

    it('GET is not allowed', async () => {
      try {
        await firebase
          .firestore()
          .doc(`${collectionName}/${orderProductFromOrganization1.id}`)
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
          .add(orderProductFromOrganization1 as any);
        throw new Error('Should fail');
      } catch (error) {
        expect(error.message).toMatch(/Missing or insufficient permissions/);
      }
      return;
    });
    it('UPDATE is not allowed', async () => {
      const updatedOrder: Partial<OrderProduct> = {
        image: 'qwe',
      };
      try {
        await firebase
          .firestore()
          .doc(`${collectionName}/${orderProductFromOrganization1.id}`)
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
          .doc(`${collectionName}/${orderProductFromOrganization1.id}`)
          .delete();
        throw new Error('Should fail');
      } catch (error) {
        expect(error.message).toMatch(/Missing or insufficient permissions/);
      }
      return;
    });
  });
});
