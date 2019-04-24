import { Location as AngularLocation } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Location } from '@shared/types/location.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { first, map, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { LocationsRemoveAction } from '../+actions/remove.action';
import { LocationsRestoreAction } from '../+actions/restore.action';
import { AppState } from '../../../+core/store/app.state';
import { getActiveOrganizationId } from '../../../+core/store/selectors';
import { unwrapCollectionSnapshotChanges } from '../../../+shared/helpers/firestore.helper';
import { LocationsEditorCreateAction } from './+actions/create.action';
import { LocationsEditorItemLoadAction } from './+actions/load.action';
import { LocationsEditorSaveAction } from './+actions/save.action';
import { LocationsEditorUpdateAction } from './+actions/update.action';
import {
  getLocationsEditorCanBeDeleted,
  getLocationsEditorCanBeRestored,
  getLocationsEditorCanBeSaved,
  getLocationsEditorIsLoadingLocation,
  getLocationsEditorIsNew,
  getLocationsEditorIsReadOnly,
  getLocationsEditorIsSaveEnabled,
  getLocationsEditorIsSaving,
  getLocationsEditorLoadLocationError,
  getLocationsEditorLocation,
  getLocationsEditorSaveError,
} from './editor.selectors';
import { getCurrentUser } from '../../../../../../../shared/getUser.helper';

@Component({
  selector: 'fr-locations-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationsEditorComponent implements OnInit, OnDestroy {
  form: FormGroup;
  sub = new Subscription();
  isNew$ = this.store.pipe(select(getLocationsEditorIsNew));
  isLoadingLocation$ = this.store.pipe(select(getLocationsEditorIsLoadingLocation));
  loadLocationError$ = this.store.pipe(select(getLocationsEditorLoadLocationError));
  saveError$ = this.store.pipe(select(getLocationsEditorSaveError));
  location$ = this.store.pipe(select(getLocationsEditorLocation));
  isSaving$ = this.store.pipe(select(getLocationsEditorIsSaving));
  isReadOnly$ = this.store.pipe(select(getLocationsEditorIsReadOnly));
  isSaveEnabled$ = this.store.pipe(select(getLocationsEditorIsSaveEnabled));
  canBeDeleted$ = this.store.pipe(select(getLocationsEditorCanBeDeleted));
  canBeRestored$ = this.store.pipe(select(getLocationsEditorCanBeRestored));
  canBeSaved$ = this.store.pipe(select(getLocationsEditorCanBeSaved));

  constructor(
    private location: AngularLocation,
    private store: Store<AppState>,
    private db: AngularFirestore,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<LocationsEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
  ) {}

  ngOnInit() {
    this.initLocation();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  initLocation() {
    const locationId = this.data ? this.data.id : null;
    if (locationId) {
      this.store.dispatch(new LocationsEditorItemLoadAction(locationId));
    } else {
      this.store.dispatch(new LocationsEditorCreateAction());
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  remove(location: Location): void {
    this.store.dispatch(new LocationsRemoveAction(location));
    this.dialogRef.close();
  }

  restore(location: Location): void {
    this.store.dispatch(new LocationsRestoreAction(location));
  }

  async save(location): Promise<void> {
    if (await this.checkCodeUnique(location)) {
      this.store.dispatch(new LocationsEditorSaveAction());
      this.dialogRef.close(); //TODO
    } else {
      this.snackBar.open(`Location code "${location.code}'"is already taken`, null, { duration: 2500 });
    }
  }

  async checkCodeUnique(location: Location): Promise<boolean> {
    const userId = (await getCurrentUser(this.store)).id;
    return this.store
      .pipe(
        select(getActiveOrganizationId),
        first(),
        switchMap(organizationId => {
          return this.db
            .collection<Location>(`${CollectionNames.locations}`, ref =>
              ref
                .limit(20)
                .where('code', '==', location.code)
                .where('availableForUsers', 'array-contains', userId)
                .where('organizationId', '==', organizationId),
            )
            .snapshotChanges()
            .pipe(
              map(unwrapCollectionSnapshotChanges),
              first(),
            );
        }),
        map(locations => {
          const duplicatedLocations = location.id ? locations.filter(l => l.id !== location.id) : locations || [];
          return !duplicatedLocations.length;
        }),
      )
      .toPromise();
  }

  patchLocation(locationData: Partial<Location>): void {
    this.store.dispatch(new LocationsEditorUpdateAction(locationData));
  }
}
