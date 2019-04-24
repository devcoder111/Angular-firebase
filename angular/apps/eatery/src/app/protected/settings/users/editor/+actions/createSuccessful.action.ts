// import { User } from '@shared/types/user.interface';
// import { BaseAction, generateActionType} from '../../../../../+shared/helpers/state.helper'; import { setStateProperties } from '@shared/helpers/state/state.helper';
// import { USERS_STATE_FEATURE_NAME } from '../../users-state.module';
// import { UsersState } from '../../users.state';
//
// const type = generateActionType(USERS_STATE_FEATURE_NAME, 'Editor - Create successful');
//
// export class UsersEditorCreateSuccessfulAction implements BaseAction<UsersState> {
//   feature = USERS_STATE_FEATURE_NAME;
//   type = type;
//
//   constructor(public payload: User) {}
//
//   handler(state: UsersState, action: this): UsersState {
//     const editor = setStateProperties(state.editor, {
//       isNew: true,
//       isLoadingUser: false,
//       user: action.payload,
//     });
//     return setStateProperties(state, { editor });
//   }
// }
