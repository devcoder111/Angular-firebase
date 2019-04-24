// import { Injectable } from '@angular/core';
// import { MatSnackBar } from '@angular/material';
// import { Actions, Effect, ofType } from '@ngrx/effects';
// import { tap } from 'rxjs/operators';
// import { BaseAction, generateActionType} from '../../../../../+shared/helpers/state.helper'; import { setStateProperties } from '@shared/helpers/state/state.helper';
// import { LoggerService } from '../../../../+shared/services/logger.service';
// import { USERS_STATE_FEATURE_NAME } from '../../users-state.module';
// import { UsersState } from '../../users.state';
//
// const type = generateActionType(USERS_STATE_FEATURE_NAME, 'Editor - Save failed');
//
// export class UsersEditorSaveFailedAction implements BaseAction<UsersState> {
//   feature = USERS_STATE_FEATURE_NAME;
//   type = type;
//
//   constructor(public payload: Error) {}
//
//   handler(state: UsersState, action: this): UsersState {
//     const editor = setStateProperties(state.editor, {
//       isSaving: false,
//       saveError: action.payload,
//     });
//     return setStateProperties(state, { editor });
//   }
// }
//
// @Injectable()
// export class UsersEditorSaveFailedActionEffect {
//   @Effect({ dispatch: false })
//   saveFailed$ = this.actions$.pipe(
//     ofType(type),
//     tap((action: UsersEditorSaveFailedAction) => {
//       this.logger.error('UsersEditorSaveFailedActionEffect.saveFailed$', action.payload);
//       this.snackBar.open(`User save failed`, null, {
//         duration: 2500,
//       });
//     }),
//   );
//
//   constructor(private actions$: Actions, private snackBar: MatSnackBar, private logger: LoggerService) {}
// }
