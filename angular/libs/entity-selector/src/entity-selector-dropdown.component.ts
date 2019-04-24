import { Inject, InjectionToken } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { EntitySelectorDropdownWrapper } from '@libs/entity-selector/src/dropdown-wrapper.service';
import { EntitySelectorComponent } from '@libs/entity-selector/src/entity-selector.component';
import { EntitySelectorConfig } from '@libs/entity-selector/src/entity-selector.module';
import { AngularFirestore } from 'angularfire2/firestore';

export const ENTITY_SELECTOR_DROPDOWN_DATA = new InjectionToken<EntitySelectorConfig<any>>(
  'ENTITY_SELECTOR_DROPDOWN_DATA',
);

export class EntitySelectorDropdownComponent extends EntitySelectorComponent {
  constructor(
    @Inject(ENTITY_SELECTOR_DROPDOWN_DATA) public data: EntitySelectorConfig<any>,
    public dropdownWrapper: EntitySelectorDropdownWrapper,
    public firestore: AngularFirestore,
  ) {
    super(data, (dropdownWrapper as any) as MatDialogRef<EntitySelectorComponent>, firestore);
  }
}
