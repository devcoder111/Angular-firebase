// import { Injectable } from '@angular/core';
// import { Actions, Effect, ofType } from '@ngrx/effects';
// import { Store } from '@ngrx/store';
// import { User } from '@shared/types/user.interface';
// import { CollectionNames } from '@shared/values/collectionNames.map';
// import { AngularFirestore } from 'angularfire2/firestore';
// import { of } from 'rxjs/observable/of';
// import { catchError, map, switchMap } from 'rxjs/operators';
// import { AppState } from '../../../../../+core/store/app.state';
// import { unwrapDocSnapshotChanges } from '../../../../../+shared/helpers/firestore.helper';
// import { BaseAction, generateActionType} from '../../../../../+shared/helpers/state.helper'; import { setStateProperties } from '@shared/helpers/state/state.helper';
// import { USERS_STATE_FEATURE_NAME } from '../../users-state.module';
// import { UsersState } from '../../users.state';
// import { UsersEditorLoadUserFailedAction } from './loadFailed.action';
// import { UsersEditorLoadSuccessfulAction } from './loadSuccessful.action';
// import { UsersEditorUpdateAction } from './update.action';
//
// const type = generateActionType(USERS_STATE_FEATURE_NAME, 'Editor - Load');
//
// export class UsersEditorItemLoadAction implements BaseAction<UsersState> {
//   feature = USERS_STATE_FEATURE_NAME;
//   type = type;
//
//   constructor(public payload: string) {}
//
//   handler(state: UsersState, action: this): UsersState {
//     const editor = setStateProperties(state.editor, {
//       isLoadingUser: true,
//       user: null,
//       loadUserError: null,
//     });
//     return setStateProperties(state, { editor });
//   }
// }
//
// @Injectable()
// export class UsersEditorLoadActionEffect {
//   @Effect()
//   watchItem$ = this.actions$.pipe(
//     ofType(type),
//     switchMap((action: UsersEditorItemLoadAction) =>
//       this.db
//         .doc<User>(`${CollectionNames.users}/${action.payload}`)
//         .snapshotChanges()
//         .pipe(
//           map(unwrapDocSnapshotChanges),
//           map(
//             (item: User, indexOfEvent: number) =>
//               indexOfEvent === 0 // if first time
//                 ? new UsersEditorLoadSuccessfulAction(item)
//                 : new UsersEditorUpdateAction(item),
//           ),
//           catchError(error => of(new UsersEditorLoadUserFailedAction(error))),
//           // TODO for Anton: Unsubscribe when user leaves /users/:id
//         ),
//     ),
//   );
//
//   constructor(private actions$: Actions, private store: Store<AppState>, private db: AngularFirestore) {}
// }
