import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductCategoriesListComponent } from './productCategories/list/list.component';

const routes: Routes = [
  {
    path: '',
    component: ProductCategoriesListComponent,
  },
  {
    path: 'product-categories',
    component: ProductCategoriesListComponent,
  },
  {
    path: 'users',
    loadChildren: './users/users.module#UsersModule',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
