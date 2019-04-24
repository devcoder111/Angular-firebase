import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersEditorComponent } from './editor/editor.component';
import { OrdersListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '',
    component: OrdersListComponent,
  },
  {
    path: 'create',
    component: OrdersEditorComponent,
  },
  {
    path: ':id',
    component: OrdersEditorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRoutingModule {}
