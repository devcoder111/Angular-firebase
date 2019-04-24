import { Environment, EnvironmentType } from './environment.interface';

export const environment: Environment = {
  type: EnvironmentType.dev,
  baseUrl: '<YOUR_BASEURL>/',
  firebase: {
    apiKey: '<YOUR_FIREBASE_API_KEY>',
    authDomain: '<YOUR_FIREBASE_AUTH_DOMAIN>',
    databaseURL: '<YOUR_FIREBASE_DATABASE_URL>',
    projectId: '<YOUR_FIREBASE_PROJECT_ID>',
    storageBucket: '<YOUR_FIREBASE_STORAGE_BUCKET>',
    messagingSenderId: '<YOUR_FIREBASE_MESSAGING_SENDER_ID>',
  },
};
