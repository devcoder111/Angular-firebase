import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { EntitySelectorComponent } from '@libs/entity-selector/src/entity-selector.component';
import { EntitySelectorConfig } from '@libs/entity-selector/src/entity-selector.module';
import { AngularFirestore } from 'angularfire2/firestore';

export class EntitySelectorComponentDialog extends EntitySelectorComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EntitySelectorConfig<any>,
    public dialogRef: MatDialogRef<EntitySelectorComponent>,
    public firestore: AngularFirestore,
  ) {
    super(data, dialogRef, firestore);
  }
}
