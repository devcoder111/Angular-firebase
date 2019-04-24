import { SuppliersEditorState, SuppliersEditorStateInitial } from './editor/editor.state';
import { SuppliersListState, SuppliersListStateInitial } from './list/list.state';

export interface SuppliersState {
  list: SuppliersListState;
  editor: SuppliersEditorState;
}

export const SuppliersStateInitial = {
  list: SuppliersListStateInitial,
  editor: SuppliersEditorStateInitial,
};
