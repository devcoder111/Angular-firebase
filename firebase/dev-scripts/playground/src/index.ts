import * as admin from 'firebase-admin';
import { User } from '../../../../shared/types/user.interface';

const x: User = null; // DON'T REMOVE: it is used for proper path to `dist/.../index.js`
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
}

async function main(): Promise<void> {
  initFirebaseAdminLib();

  console.time('Playground code execution time');
  try {
    // Your code from here
    // Your code until here
  } catch (error) {
    console.error('Playground code exception:', error);
  }
  console.timeEnd('Playground code execution time');

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
