import * as admin from 'firebase-admin';
import {
  createFirestoreCollection,
  deleteFirestoreCollection,
  DemoDataCollectionConfig,
} from '../../+shared/firestore';
import { CollectionNames } from '../../../../shared/values/collectionNames.map';
import { DemoData } from '../../../demo-data/firestore/backup';
import { createUsersInFirebaseAuthentication, deleteUsersFromFirebaseAuthentication } from './authentication';
import { deleteFilesInStorage, uploadInvoicesFiles, uploadOrdersFiles } from './storage';

const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

checkArgs();

main();

// ------

function checkArgs(): void {
  if (!argv.secretkey && !argv.secretkeystring && !argv.qa && !argv.e2e) {
    console.error(
      `
ERROR: Provide Firebase Service Account Key. 
Option 1: As path to file: "--secretkey /path/to/secretfile.json"
Option 2: As JSON string: "--secretkeystring <stringifiedSecretKey>"
Option 3: Using "--qa" param to use hardcoded qa key
Option 2: Using "--e2e" param to use hardcoded e2e key`,
    );
    process.exit();
  }
  if (argv.qa) {
    argv.secretkey = '../foodrazor-qa-account-key.json';
  }
  if (argv.e2e) {
    argv.secretkey = '../foodrazor-e2e-account-key.json';
  }
}

async function main(): Promise<void> {
  try {
    initFirebaseAdminLib();
    const firestore = admin.firestore();

    const dbCollectionConfigs = getDBCollectionConfigs();
    dbCollectionConfigs.forEach(collectionConfig => {
      const demoDataForCollection = DemoData[collectionConfig.path];
      const isDemoDataExists = !!demoDataForCollection && !!Object.keys(demoDataForCollection).length;
      if (!collectionConfig.dataMap && isDemoDataExists) {
        collectionConfig.dataMap = demoDataForCollection;
      }
    });

    console.time('---Deleting stuff');
    console.log('\n---Deleting stuff...');
    await Promise.all([
      // parallel
      ...dbCollectionConfigs.map(c => deleteFirestoreCollection(firestore, c.path)),
      deleteUsersFromFirebaseAuthentication(),
      deleteFilesInStorage(),
    ]);
    console.timeEnd('---Deleting stuff');

    console.time('---Creating stuff');
    console.log('\n---Creating stuff...');
    const authAndFireStore = async (): Promise<void> => {
      for (const collectionConfig of dbCollectionConfigs) {
        await createFirestoreCollection(firestore, collectionConfig); // sequential
      }
      await createUsersInFirebaseAuthentication();
    };
    await Promise.all([uploadInvoicesFiles(), uploadOrdersFiles(), authAndFireStore()]);
    console.timeEnd('---Creating stuff');

    process.exit();
  } catch (error) {
    console.error(error);
  }
}

// ------

function initFirebaseAdminLib(): string {
  console.time('Initiating Firebase Admin');
  console.log('Initiating Firebase Admin...');
  try {
    let serviceAccount: any;
    if (argv.secretkey) {
      serviceAccount = require(path.resolve(argv.secretkey));
    } else if (argv.secretkeystring) {
      serviceAccount = JSON.parse(argv.secretkeystring);
    }
    if (!serviceAccount) {
      throw new Error('Service Account JSON is empty. Please check your params');
    }
    console.log('--------------------------------------');
    console.log('PROJECT ID:', serviceAccount.project_id);
    console.log('--------------------------------------');
    const storageBucket = `${serviceAccount.project_id}.appspot.com`;
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket,
    });
    console.timeEnd('Initiating Firebase Admin');
    return serviceAccount.project_id;
  } catch (error) {
    console.error('initFirebaseAdminLib error:', error);
    process.exit(1);
    return null;
  }
}

function getDBCollectionConfigs(): DemoDataCollectionConfig[] {
  return [
    {
      path: CollectionNames.users,
    },
    {
      path: CollectionNames.usersConfigs,
    },
    {
      path: CollectionNames.productCategories,
      // "productCategories" go before "organizations" to make sure they won't be created automatically by
      // firebase/functions/src/fs/organizations/onCreate/createDefaultProductCategories.ts
    },
    {
      path: CollectionNames.organizations,
      batchSize: 1,
    },
    {
      path: CollectionNames.locations,
      batchSize: 1,
    },
    {
      path: CollectionNames.permissions,
    },
    {
      path: CollectionNames.unitTypes,
    },
    {
      path: CollectionNames.invoiceAdjustmentTypes,
    },
    {
      path: CollectionNames.countersLocationOrderNumber,
    },
    {
      path: CollectionNames.countersLocationInvoicesDone,
    },
    {
      path: CollectionNames.countersOrganizationInvoicesDone,
    },
    {
      path: CollectionNames.orders,
      delayMsBeforeImportCollection: 5000, // to prevent error when order number counter is not created yet
    },
    {
      path: CollectionNames.orderProducts,
    },
    {
      path: CollectionNames.files,
    },
    {
      path: CollectionNames.invoices,
    },
    {
      path: CollectionNames.invoiceProducts,
    },
    {
      path: CollectionNames.invoiceAdjustments,
    },
    {
      path: CollectionNames.suppliers,
    },
    {
      path: CollectionNames.products,
    },
    {
      path: CollectionNames.notificationsQueue,
    },
  ];
}
