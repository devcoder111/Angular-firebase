import { ProductsEditorState, ProductsEditorStateInitial } from './editor/editor.state';
import { ProductsListState, ProductsListStateInitial } from './list/list.state';

export interface ProductsState {
  list: ProductsListState;
  editor: ProductsEditorState;
}

export const ProductsStateInitial = {
  list: ProductsListStateInitial,
  editor: ProductsEditorStateInitial,
};
