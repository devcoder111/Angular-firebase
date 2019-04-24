import { NgModule } from '@angular/core';
import { EntitySelectorModule } from '@libs/entity-selector';
import { KeysModule } from '@libs/keys';
import { MoneyModule } from '@libs/money';
import { OrderHelpersModule } from '@libs/order-helpers';
import { ProtectedSharedModule } from '../+shared/shared.module';
import { OrdersEditorComponent } from './editor/editor.component';
import { OrdersEditorFormComponent } from './editor/form/form.component';
import { OrdersEditorProductsProductComponent } from './editor/form/product/product.component';
import { OrdersListFilterComponent } from './list/filter/filter.component';
import { OrdersListComponent } from './list/list.component';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersStoreModule } from './orders-state.module';

@NgModule({
  imports: [
    ProtectedSharedModule,
    OrdersRoutingModule,
    OrdersStoreModule,
    OrderHelpersModule,
    MoneyModule,
    KeysModule,
    EntitySelectorModule,
  ],
  declarations: [
    OrdersListComponent,
    OrdersListFilterComponent,
    OrdersEditorComponent,
    OrdersEditorFormComponent,
    OrdersEditorProductsProductComponent,
  ],
})
export class OrdersModule {}
