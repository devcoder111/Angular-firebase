import * as firebase from 'firebase';

export function configureFirebase() {
  firebase.initializeApp({
    apiKey: 'AIzaSyDZa9xgID1kHjhoC1ehYGJF6t5gSS9PHAo',
    authDomain: 'foodrazor-e2e.firebaseapp.com',
    databaseURL: 'https://foodrazor-e2e.firebaseio.com',
    projectId: 'foodrazor-e2e',
    storageBucket: 'foodrazor-e2e.appspot.com',
    messagingSenderId: '692351716591',
  });
  const firestore = firebase.firestore();
  const settings = { timestampsInSnapshots: true };
  firestore.settings(settings);
}
