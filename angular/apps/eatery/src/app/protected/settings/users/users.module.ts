import { NgModule } from '@angular/core';
import { UsersListComponent } from './list/list.component';
import { UsersRoutingModule } from './users-routing.module';
import { UsersListFilterComponent } from './list/filter/filter.component';
import { ProtectedSharedModule } from '../../+shared/shared.module';
import { UsersStoreModule } from './users-state.module';
import { EntitySelectorModule } from '@libs/entity-selector';

@NgModule({
  imports: [ProtectedSharedModule, UsersRoutingModule, UsersStoreModule, EntitySelectorModule],
  declarations: [
    // UsersEditorComponent,
    // UsersEditorFormComponent,
    UsersListComponent,
    UsersListFilterComponent,
  ],
})
export class UsersModule {}
