// import { Injectable } from '@angular/core';
// import { Actions, Effect, ofType } from '@ngrx/effects';
// import { tap } from 'rxjs/operators';
// import { BaseAction, generateActionType} from '../../../../../+shared/helpers/state.helper'; import { setStateProperties } from '@shared/helpers/state/state.helper';
// import { LoggerService } from '../../../../+shared/services/logger.service';
// import { USERS_STATE_FEATURE_NAME } from '../../users-state.module';
// import { UsersState } from '../../users.state';
//
// const type = generateActionType(USERS_STATE_FEATURE_NAME, 'Editor - Load user failed');
//
// export class UsersEditorLoadUserFailedAction implements BaseAction<UsersState> {
//   feature = USERS_STATE_FEATURE_NAME;
//   type = type;
//
//   constructor(public payload: Error) {}
//
//   handler(state: UsersState, action: this): UsersState {
//     const editor = setStateProperties(state.editor, {
//       isLoadingUser: false,
//       loadUserError: action.payload,
//     });
//     return setStateProperties(state, { editor });
//   }
// }
//
// @Injectable()
// export class UsersEditorLoadUserFailedActionEffect {
//   @Effect()
//   logError$ = this.actions$.pipe(
//     ofType(type),
//     tap((action: UsersEditorLoadUserFailedAction) => {
//       this.logger.error('UsersEditorLoadUserFailedActionEffect.logError$: ', action.payload);
//     }),
//   );
//
//   constructor(private actions$: Actions, private logger: LoggerService) {}
// }
