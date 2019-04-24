import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoicesEditorComponent } from './editor/editor.component';
import { InvoicesListComponent } from './list/list.component';
import { InvoicesUploadComponent } from './upload/upload.component';

const routes: Routes = [
  {
    path: '',
    component: InvoicesListComponent,
  },
  {
    path: 'upload',
    component: InvoicesUploadComponent,
  },
  {
    path: 'create',
    component: InvoicesEditorComponent,
  },
  {
    path: ':id',
    component: InvoicesEditorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoicesRoutingModule {}
