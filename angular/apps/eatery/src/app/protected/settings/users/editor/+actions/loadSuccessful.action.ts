// import { User } from '@shared/types/user.interface';
// import { BaseAction, generateActionType} from '../../../../../+shared/helpers/state.helper'; import { setStateProperties } from '@shared/helpers/state/state.helper';
// import { USERS_STATE_FEATURE_NAME } from '../../users-state.module';
// import { UsersState } from '../../users.state';
//
// const type = generateActionType(USERS_STATE_FEATURE_NAME, 'Editor - Load successful');
//
// export class UsersEditorLoadSuccessfulAction implements BaseAction<UsersState> {
//   feature = USERS_STATE_FEATURE_NAME;
//   type = type;
//
//   constructor(public payload: User) {}
//
//   handler(state: UsersState, action: this): UsersState {
//     const editor = setStateProperties(state.editor, {
//       isLoadingUser: false,
//       loadUserError: null,
//       user: action.payload,
//       isNew: false,
//     });
//     return setStateProperties(state, { editor });
//   }
// }
