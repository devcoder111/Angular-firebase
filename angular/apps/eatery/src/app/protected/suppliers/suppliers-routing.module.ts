import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuppliersEditorComponent } from './editor/editor.component';
import { SuppliersListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '',
    component: SuppliersListComponent,
  },
  {
    path: 'create',
    component: SuppliersEditorComponent,
  },
  {
    path: ':id',
    component: SuppliersEditorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuppliersRoutingModule {}
