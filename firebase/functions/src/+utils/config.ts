import * as functions from 'firebase-functions';

const FIREBASE_CONFIG = JSON.parse(process.env.FIREBASE_CONFIG);
const FIREBASE_ENVIRONMENT_VARIABLES = functions.config();
const mergedConfig = {
  ...FIREBASE_CONFIG,
  ...FIREBASE_ENVIRONMENT_VARIABLES,
  storageBucketWithoutGSprefix: FIREBASE_CONFIG.storageBucket,
  storageBucketWithGSprefix: `gs://${FIREBASE_CONFIG.storageBucket}`,
};

export function getConfig(): {
  projectId: string;
  storageBucketWithoutGSprefix: string;
  storageBucketWithGSprefix: string;
  databaseURL: string;
  sendgrid: { secretkey: string };
  hoiio: { appid: string; accesstoken: string };
  cron: { key: string };
  twilio: {
    sid: string;
    token: string;
    from: string;
  };
} {
  return mergedConfig;
}

export function getFrontendURL(): string {
  return `https://${getConfig().projectId}.firebaseapp.com`;
}
