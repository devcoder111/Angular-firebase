import * as admin from 'firebase-admin';
import { deleteFirestoreCollection } from '../../+shared/firestore';
import { CollectionNames } from '../../../../shared/values/collectionNames.map';
import { exportFirestore } from './firestore/export';
import { importFirestore } from './firestore/import';

const fs = require('fs-extra');

const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

checkArgs();
main();

// ------

function checkArgs(): void {
  if (!argv.secretkey) {
    console.error(
      'ERROR: Provide path to Firebase Service Account Key as "--secretkey" variable. ' +
        'Example: "--secretkey /path/to/secretfile.json"',
    );
    process.exit();
  }
  if (argv.import && argv.export) {
    console.error('ERROR: Choose only one command. Example: "--export" or "--import"');
    process.exit();
  }
  if (!argv.import && !argv.export) {
    console.error('ERROR: Choose import or export command. Example: "--export" or "--import"');
    process.exit();
  }

  if (argv.import && !argv.source) {
    console.error('ERROR: Provide path to source. Example: "--source /path/to/backup.json"');
    process.exit();
  }
}

async function main(): Promise<void> {
  initFirebaseAdminLib();

  console.time('Operation execution time');
  try {
    const firestore = admin.firestore();
    if (argv.export) {
      console.log('Backup in progress...');
      const backup = await exportFirestore(firestore as any, Object.keys(CollectionNames));
      const backupsDirPath = `./backups`;
      await fs.ensureDir(backupsDirPath);
      const backupPath = `${backupsDirPath}/firestore-${new Date().toISOString()}.json`;
      fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2), 'utf8');
      console.log(`Backup was saved to ${backupPath}`);
    }

    if (argv.import) {
      if (argv['delete-existing-data'] || argv.D) {
        console.log('Deleting existing data...');
        const promises = Object.keys(CollectionNames).map(collectionName =>
          deleteFirestoreCollection(firestore, collectionName),
        );
        await Promise.all([...promises]);
        console.log('Existing data was deleted');
      }
      console.log('Restoring backup...');
      const backup = JSON.parse(fs.readFileSync(argv.source, 'utf8'));
      await importFirestore(firestore as any, backup);
      console.log('Backup restored');
    }
  } catch (error) {
    console.error(error);
  }
  console.timeEnd('Operation execution time');

  process.exit();
}

// ------

function initFirebaseAdminLib(): string {
  console.time('Initiating Firebase Admin');
  console.log('Initiating Firebase Admin...');
  try {
    const serviceAccount = require(path.resolve(argv.secretkey));
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
