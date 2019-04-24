import { NgModule } from '@angular/core';
import { AutocompleteInputComponent } from '@libs/entity-selector/src/autocomplete-input.component';
import { FilterByFieldModule } from '@libs/filter-by-field';
import { SharedModule } from '../../+shared/shared.module';
import { HeaderComponent } from './header/header.component';
import { OrganizationLocationSelectorComponent } from './organizationLocationSelector/organizationLocationSelector.component';
import { OrganizationLocationSelectorPipe } from './organizationLocationSelector/organizationLocationSelector.pipe';
import { StatusFilterComponent } from './statusFilter/statusFilter.component';

@NgModule({
  imports: [SharedModule, FilterByFieldModule],
  declarations: [
    HeaderComponent,
    StatusFilterComponent,
    OrganizationLocationSelectorComponent,
    OrganizationLocationSelectorPipe,
    AutocompleteInputComponent,
  ],
  exports: [
    SharedModule,
    HeaderComponent,
    StatusFilterComponent,
    AutocompleteInputComponent,
    OrganizationLocationSelectorComponent,
  ],
})
export class ProtectedSharedModule {}
