// import { Injectable } from '@angular/core';
// import { MatSnackBar } from '@angular/material';
// import { Router } from '@angular/router';
// import { Actions, Effect, ofType } from '@ngrx/effects';
// import { tap } from 'rxjs/operators';
// import { BaseAction, generateActionType} from '../../../../../+shared/helpers/state.helper'; import { setStateProperties } from '@shared/helpers/state/state.helper';
// import { USERS_STATE_FEATURE_NAME } from '../../users-state.module';
// import { UsersState } from '../../users.state';
//
// const type = generateActionType(USERS_STATE_FEATURE_NAME, 'Editor - Save successful');
//
// export class UsersEditorSaveSuccessfulAction implements BaseAction<UsersState> {
//   feature = USERS_STATE_FEATURE_NAME;
//   type = type;
//
//   handler(state: UsersState, action: this): UsersState {
//     const editor = setStateProperties(state.editor, {
//       isSaving: false,
//     });
//     return setStateProperties(state, { editor });
//   }
// }
//
// @Injectable()
// export class UsersEditorSaveSuccessfulActionEffect {
//   @Effect({ dispatch: false })
//   saveSuccessful$ = this.actions$.pipe(
//     ofType(type),
//     tap(() => {
//       this.snackBar.open(`User was saved`, null, {
//         duration: 2500,
//       });
//       // noinspection JSIgnoredPromiseFromCall
//       this.router.navigate(['/users']);
//     }),
//   );
//
//   constructor(private actions$: Actions, private snackBar: MatSnackBar, private router: Router) {}
// }
