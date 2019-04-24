import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { UsersEditorComponent } from './editor/editor.component';
import { UsersListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '',
    component: UsersListComponent,
  },
  // {
  //   path: 'create',
  //   component: UsersEditorComponent,
  // },
  // {
  //   path: ':id',
  //   component: UsersEditorComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
