import { Organization } from '@shared/types/organization.interface';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import { createId } from '../../../+utils/createId';
import { getFirestore } from '../../../+utils/firestore';
import { CollectionNames } from '../../../../../../shared/values/collectionNames.map';

const firestore = getFirestore();

export async function fsCreateDefaultProductCategories(snapshot: DocumentSnapshot): Promise<void> {
  const id = snapshot.id;
  const organizationWithId = { id, ...snapshot.data() } as Organization;
  const productCategoriesStrings = [
    'Drinks-alcoholic',
    'Drinks-non-alcoholic',
    'Food-Meat',
    'Food-Fruits & vegetables',
    'Consumable',
    'Equipments',
    'Others',
    'Services',
  ];
  const productCategories = productCategoriesStrings.map(str => ({
    name: str,
    organizationId: organizationWithId.id,
    isDeleted: false,
    locked: true,
  }));
  const logData = {
    organization: organizationWithId,
    productCategories: productCategories,
  };

  try {
    console.log('fsCreateDefaultProductCategories - Working on:', logData);

    await firestore.runTransaction(async transaction => {
      const query = firestore
        .collection(CollectionNames.productCategories)
        .where('organizationId', '==', id)
        .limit(1);
      const productCategoriesQuerySnapshot = await transaction.get(query);
      if (!productCategoriesQuerySnapshot.empty) {
        return;
        // Organization is most probably imported as demo-data, so it already has productCategories.
      }
      for (const productCategory of productCategories) {
        const productCategoryPath = `${CollectionNames.productCategories}/${createId()}`;
        const pcRef = firestore.doc(productCategoryPath);
        transaction.create(pcRef, productCategory);
      }
    });

    console.log('fsCreateDefaultProductCategories - completed.', logData);
  } catch (error) {
    console.error('fsCreateDefaultProductCategories', error, logData);
    throw new Error(error);
  }
}
