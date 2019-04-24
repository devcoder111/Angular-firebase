import { NgModule } from '@angular/core';
import { EntitySelectorModule } from '@libs/entity-selector';
import { ProtectedSharedModule } from '../+shared/shared.module';
import { ProductCategoriesEditorComponent } from './productCategories/editor/editor.component';
import { ProductCategoriesListFilterComponent } from './productCategories/list/filter/filter.component';
import { ProductCategoriesListComponent } from './productCategories/list/list.component';
import { ProductCategoriesStoreModule } from './productCategories/productCategories-state.module';
import { SettingsRoutingModule } from './settings-routing.module';

@NgModule({
  imports: [ProtectedSharedModule, EntitySelectorModule, SettingsRoutingModule, ProductCategoriesStoreModule],
  declarations: [
    ProductCategoriesListComponent,
    ProductCategoriesEditorComponent,
    ProductCategoriesListFilterComponent,
  ],
})
export class SettingsModule {}
