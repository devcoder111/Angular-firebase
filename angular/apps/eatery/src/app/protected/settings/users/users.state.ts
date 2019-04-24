// import { UsersEditorState, UsersEditorStateInitial } from './editor/editor.state';
import { UsersListState, UsersListStateInitial } from './list/list.state';

export interface UsersState {
  list: UsersListState;
  // editor: UsersEditorState;
}

export const UsersStateInitial = {
  list: UsersListStateInitial,
  // editor: UsersEditorStateInitial,
};
