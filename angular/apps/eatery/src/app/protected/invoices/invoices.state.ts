import { InvoicesEditorState, InvoicesEditorStateInitial } from './editor/editor.state';
import { InvoicesListState, InvoicesListStateInitial } from './list/list.state';

export interface InvoicesState {
  list: InvoicesListState;
  editor: InvoicesEditorState;
}

export const InvoicesStateInitial = {
  list: InvoicesListStateInitial,
  editor: InvoicesEditorStateInitial,
};
