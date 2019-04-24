import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { select, Store } from '@ngrx/store';
import { Location } from '@shared/types/location.interface';
import { LocationsRemoveAction } from '../+actions/remove.action';
import { LocationsRestoreAction } from '../+actions/restore.action';
import { LocationsSetActiveItemIdAction } from '../../../+core/store/actions/locationsSetActiveItemId.action';
import { AppState } from '../../../+core/store/app.state';
import {
  getLocationsInActiveOrganization,
  getLocationsListIsLoading,
  getLocationsListLoadError,
} from '../../../+core/store/selectors';
import { trackByFn } from '../../../../../../../shared/trackBy.helper';
import { LocationsEditorComponent } from '../editor/editor.component';
import { canLocationBeDeleted, canLocationBeRestored } from '../helpers/selectors.helpers';

@Component({
  selector: 'fr-locations-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationsListComponent {
  locations$ = this.store.pipe(select(getLocationsInActiveOrganization));
  isLoading$ = this.store.pipe(select(getLocationsListIsLoading));
  loadError$ = this.store.pipe(select(getLocationsListLoadError));
  form: FormGroup;
  canBeDeleted = canLocationBeDeleted;
  canBeRestored = canLocationBeRestored;

  trackByFn = trackByFn;

  constructor(private store: Store<AppState>, public dialog: MatDialog) {}

  select(location: Location) {
    this.store.dispatch(new LocationsSetActiveItemIdAction({ location, shouldNotify: true, shouldRedirect: true }));
  }

  edit(id: string) {
    this.dialog.open(LocationsEditorComponent, { width: '450px', data: { id } });
  }

  create() {
    this.dialog.open(LocationsEditorComponent, { width: '450px' });
  }

  remove(location: Location): void {
    this.store.dispatch(new LocationsRemoveAction(location));
  }

  restore(location: Location): void {
    this.store.dispatch(new LocationsRestoreAction(location));
  }
}
