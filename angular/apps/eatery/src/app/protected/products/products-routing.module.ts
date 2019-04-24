import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsEditorComponent } from './editor/editor.component';
import { ProductsListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '',
    component: ProductsListComponent,
  },
  {
    path: 'create',
    component: ProductsEditorComponent,
  },
  {
    path: ':id',
    component: ProductsEditorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
