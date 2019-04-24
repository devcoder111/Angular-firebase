import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material';
import { KeysModule } from '@libs/keys';
import { RolesHelpersModule } from '@libs/roles-helpers';
import { SharedModule } from '../../+shared/shared.module';
import { LocationsEditorComponent } from './editor/editor.component';
import { LocationsEditorFormComponent } from './editor/form/form.component';
import { LocationsListComponent } from './list/list.component';

import { LocationsRoutingModule } from './locations-routing.module';
import { LocationsStoreModule } from './locations-state.module';

@NgModule({
  imports: [
    LocationsRoutingModule,
    LocationsStoreModule,
    RolesHelpersModule,
    KeysModule,
    SharedModule,
    MatDialogModule,
  ],
  declarations: [LocationsEditorComponent, LocationsEditorFormComponent, LocationsListComponent],
  entryComponents: [LocationsEditorComponent],
})
export class LocationsModule {}
