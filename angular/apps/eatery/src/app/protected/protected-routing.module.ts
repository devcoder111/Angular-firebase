import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProtectedComponent } from './protected.component';
import { ProtectedGuard } from './protected.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [ProtectedGuard],
    component: ProtectedComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule',
      },
      {
        path: 'invoices',
        loadChildren: './invoices/invoices.module#InvoicesModule',
      },
      {
        path: 'orders',
        loadChildren: './orders/orders.module#OrdersModule',
      },
      {
        path: 'suppliers',
        loadChildren: './suppliers/suppliers.module#SuppliersModule',
      },
      {
        path: 'products',
        loadChildren: './products/products.module#ProductsModule',
      },
      {
        path: 'reports',
        loadChildren: './reports/reports.module#ReportsModule',
      },
      {
        path: 'settings',
        loadChildren: './settings/settings.module#SettingsModule',
      },
      {
        path: '**',
        redirectTo: 'orders',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ProtectedGuard],
})
export class ProtectedRoutingModule {}
