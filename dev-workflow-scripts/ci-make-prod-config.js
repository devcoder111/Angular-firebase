try {
  const fs = require('fs');
  const availableEnvironments = ['prod', 'qa'];
  if (!availableEnvironments.includes(process.argv[2])) {
    console.error('Please provide one of environments - "prod" or "qa". Example: "$ node ci-make-prod-config.js prod"');
    process.exit(1);
  }

  const ENVTYPE = process.argv[2].toUpperCase();

  console.log('\nEnvironment:', ENVTYPE);

  const BASEURL = process.env[`${ENVTYPE}_BASEURL`];
  const FIREBASE_API_KEY = process.env[`${ENVTYPE}_FIREBASE_API_KEY`];
  const FIREBASE_AUTH_DOMAIN = process.env[`${ENVTYPE}_FIREBASE_AUTH_DOMAIN`];
  const FIREBASE_DATABASE_URL = process.env[`${ENVTYPE}_FIREBASE_DATABASE_URL`];
  const FIREBASE_PROJECT_ID = process.env[`${ENVTYPE}_FIREBASE_PROJECT_ID`];
  const FIREBASE_STORAGE_BUCKET = process.env[`${ENVTYPE}_FIREBASE_STORAGE_BUCKET`];
  const FIREBASE_MESSAGING_SENDER_ID = process.env[`${ENVTYPE}_FIREBASE_MESSAGING_SENDER_ID`];
  const SENTRY_DSN = process.env[`${ENVTYPE}_SENTRY_DSN`];
  const LOGROCKET_KEY = process.env[`${ENVTYPE}_LOGROCKET_KEY`];
  const RELEASE = `${process.env.CI_BUILD_NUMBER}_${process.env.CI_COMMIT_ID.substring(0, 6)}`;

  const filePath = `angular/apps/eatery/src/environments/environment.prod.ts`;
  const fileContent = `
import { Environment, EnvironmentType } from './environment.interface';

export const environment: Environment = {
  type: EnvironmentType.prod,
  baseUrl: '${BASEURL}',
  firebase: {
    apiKey: '${FIREBASE_API_KEY}',
    authDomain: '${FIREBASE_AUTH_DOMAIN}',
    databaseURL: '${FIREBASE_DATABASE_URL}',
    projectId: '${FIREBASE_PROJECT_ID}',
    storageBucket: '${FIREBASE_STORAGE_BUCKET}',
    messagingSenderId: '${FIREBASE_MESSAGING_SENDER_ID}'
  },
  sentry: '${SENTRY_DSN}',
  logRocket: '${LOGROCKET_KEY}',
  release: '${RELEASE}'
};`;
  fs.writeFileSync(filePath, fileContent);

  console.log(`\nSuccess! File saved to "${filePath}"\n\nContent:\n`, fileContent);
} catch (error) {
  console.error(error);
  process.exit(1);
}
