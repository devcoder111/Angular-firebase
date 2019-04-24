// import { User } from '@shared/types/user.interface';
// import { BaseAction, generateActionType} from '../../../../../+shared/helpers/state.helper'; import { setStateProperties } from '@shared/helpers/state/state.helper';
// import { USERS_STATE_FEATURE_NAME } from '../../users-state.module';
// import { UsersState } from '../../users.state';
//
// const type = generateActionType(USERS_STATE_FEATURE_NAME, 'Editor - Update');
//
// export class UsersEditorUpdateAction implements BaseAction<UsersState> {
//   feature = USERS_STATE_FEATURE_NAME;
//   type = type;
//
//   constructor(public payload: Partial<User>) {}
//
//   handler(state: UsersState, action: this): UsersState {
//     const user = setStateProperties(state.editor.user, {
//       ...action.payload,
//     });
//     const editor = setStateProperties(state.editor, { user });
//     return setStateProperties(state, { editor });
//   }
// }
