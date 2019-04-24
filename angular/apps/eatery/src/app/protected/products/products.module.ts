import { NgModule } from '@angular/core';
import { MoneyModule } from '@libs/money';
import { ProtectedSharedModule } from '../+shared/shared.module';
import { ProductsEditorComponent } from './editor/editor.component';
import { ProductsEditorFormComponent } from './editor/form/form.component';
import { ProductsListFilterComponent } from './list/filter/filter.component';
import { ProductsListComponent } from './list/list.component';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsStoreModule } from './products-state.module';

@NgModule({
  imports: [ProtectedSharedModule, ProductsRoutingModule, ProductsStoreModule, MoneyModule],
  declarations: [
    ProductsEditorComponent,
    ProductsEditorFormComponent,
    ProductsListComponent,
    ProductsListFilterComponent,
  ],
})
export class ProductsModule {}
