import { getFirestore } from './firestore';

export function createId(): string {
  return getFirestore()
    .collection('fakeCollection')
    .doc().id;
}
