import { ProductCategoriesEditorState, ProductCategoriesEditorStateInitial } from './editor/editor.state';
import { ProductCategoriesListState, ProductCategoriesListStateInitial } from './list/list.state';

export interface ProductCategoriesState {
  list: ProductCategoriesListState;
  editor: ProductCategoriesEditorState;
}

export const ProductCategoriesStateInitial = {
  list: ProductCategoriesListStateInitial,
  editor: ProductCategoriesEditorStateInitial,
};
