import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationsEditorComponent } from './editor/editor.component';
import { LocationsListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '',
    component: LocationsListComponent,
  },
  {
    path: 'create',
    component: LocationsEditorComponent,
  },
  {
    path: ':id',
    component: LocationsEditorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationsRoutingModule {}
