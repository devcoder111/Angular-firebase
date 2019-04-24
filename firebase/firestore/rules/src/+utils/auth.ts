import * as firebase from 'firebase';
import { AuthUser } from '../../../../demo-data/authentication/users';

export function signIn(user: AuthUser) {
  return firebase.auth().signInWithEmailAndPassword(user.email, user.password);
}

export function userId() {
  return firebase.auth().currentUser.uid;
}
