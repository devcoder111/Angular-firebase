// import { Injectable } from '@angular/core';
// import { Actions, Effect, ofType } from '@ngrx/effects';
// import { Store } from '@ngrx/store';
// import { CollectionNames } from '@shared/values/collectionNames.map';
// import { AngularFirestore } from 'angularfire2/firestore';
// import { switchMap, withLatestFrom } from 'rxjs/operators';
// import { AppState } from '../../../../../+core/store/app.state';
// import { BaseAction, generateActionType} from '../../../../../+shared/helpers/state.helper'; import { setStateProperties } from '@shared/helpers/state/state.helper';
// import { USERS_STATE_FEATURE_NAME } from '../../users-state.module';
// import { UsersState } from '../../users.state';
// import { getUsersEditorState } from '../editor.selectors';
// import { UsersEditorState } from '../editor.state';
// import { UsersEditorSaveFailedAction } from './saveFailed.action';
// import { UsersEditorSaveSuccessfulAction } from './saveSuccessful.action';
//
// const type = generateActionType(USERS_STATE_FEATURE_NAME, 'Editor - Save');
//
// export class UsersEditorSaveAction implements BaseAction<UsersState> {
//   feature = USERS_STATE_FEATURE_NAME;
//   type = type;
//
//   handler(state: UsersState, action: this): UsersState {
//     const editor = setStateProperties(state.editor, {
//       isSaving: true,
//       saveError: null,
//     });
//     return setStateProperties(state, { editor });
//   }
// }
//
// @Injectable()
// export class UsersEditorSaveActionEffect {
//   @Effect()
//   save$ = this.actions$.pipe(
//     ofType(type),
//     withLatestFrom(this.store, (action, state) => ({
//       editor: getUsersEditorState(state),
//     })),
//     switchMap((data: { editor: UsersEditorState }) => {
//       const { editor } = data;
//       const { id, ...model } = editor.user;
//       return this.db
//         .doc(`${CollectionNames.users}/${id}`)
//         .set(model)
//         .then(() => new UsersEditorSaveSuccessfulAction())
//         .catch(error => new UsersEditorSaveFailedAction(error));
//     }),
//   );
//
//   constructor(private actions$: Actions, private db: AngularFirestore, private store: Store<AppState>) {}
// }
