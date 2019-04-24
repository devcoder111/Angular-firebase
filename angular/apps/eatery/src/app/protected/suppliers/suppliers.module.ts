import { NgModule } from '@angular/core';
import { EntitySelectorModule } from '@libs/entity-selector';
import { ProtectedSharedModule } from '../+shared/shared.module';
import { SuppliersEditorComponent } from './editor/editor.component';
import { SuppliersEditorFormComponent } from './editor/form/form.component';
import { SuppliersListFilterComponent } from './list/filter/filter.component';
import { SuppliersListComponent } from './list/list.component';

import { SuppliersRoutingModule } from './suppliers-routing.module';
import { SuppliersStoreModule } from './suppliers-state.module';

@NgModule({
  imports: [ProtectedSharedModule, SuppliersRoutingModule, SuppliersStoreModule, EntitySelectorModule],
  declarations: [
    SuppliersEditorComponent,
    SuppliersEditorFormComponent,
    SuppliersListComponent,
    SuppliersListFilterComponent,
  ],
})
export class SuppliersModule {}
