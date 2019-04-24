import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, TemplateRef } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatInputModule,
  MatProgressBarModule,
} from '@angular/material';
import { CollectionReference, Query } from '@firebase/firestore-types';
import { EntitySelectorComponentDialog } from '@libs/entity-selector/src/entity-selector-dialog.component';
import { EntitySelectorDropdownComponent } from '@libs/entity-selector/src/entity-selector-dropdown.component';
import { EntitySelectorComponent } from '@libs/entity-selector/src/entity-selector.component';
import { EntitySelectorDialogService } from './entity-selector-dialog.service';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatProgressBarModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    OverlayModule,
  ],
  declarations: [EntitySelectorComponent, EntitySelectorComponentDialog, EntitySelectorDropdownComponent],
  entryComponents: [EntitySelectorComponentDialog, EntitySelectorDropdownComponent],
})
export class EntitySelectorModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: EntitySelectorModule,
      providers: [EntitySelectorDialogService],
    };
  }
}

export interface EntitySelectorConfig<T> {
  title?: string;
  searchBoxPlaceholder?: string;
  submitButtonText?: string;
  cancelButtonText?: string;
  mode: 'single' | 'multiple' | 'multipleAmount';
  selectedItems?: any[];
  minimumItems?: number;
  customTemplate?: TemplateRef<any>;
  collectionName: string;
  queries: ((ref: CollectionReference, searchText: string) => Query)[];
  clientSideFilter?: (items: T[]) => T[];
  displayField?: string;
  width?: string;
  orderByFn?: any;
  checkFn?: (item: T) => {};
  getViewValue?: (value: string, setViewValue: (viewValue: string) => void) => void;
}
