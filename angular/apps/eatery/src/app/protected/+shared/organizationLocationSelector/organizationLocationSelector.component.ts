import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Location } from '@shared/types/location.interface';
import { Organization } from '@shared/types/organization.interface';
import { LocationsSetActiveItemIdAction } from '../../../+core/store/actions/locationsSetActiveItemId.action';
import { OrganizationsSetActiveItemIdAction } from '../../../+core/store/actions/organizationsSetActiveItemId.action';
import { AppState } from '../../../+core/store/app.state';
import {
  getActivePosition,
  getAllLocations,
  getOrganizations,
  isAdminOrOwner,
  isOwner,
} from '../../../+core/store/selectors';
import { trackByFn } from '../../../../../../../shared/trackBy.helper';

@Component({
  selector: 'fr-organization-location-selector',
  templateUrl: './organizationLocationSelector.component.html',
  styleUrls: ['./organizationLocationSelector.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationLocationSelectorComponent {
  organizations$ = this.store.pipe(select(getOrganizations));
  locations$ = this.store.pipe(select(getAllLocations));
  activePosition$ = this.store.pipe(select(getActivePosition));
  isOwner$ = this.store.pipe(select(isOwner));
  isAdminOrOwner$ = this.store.pipe(select(isAdminOrOwner));

  trackByFn = trackByFn;

  constructor(private store: Store<AppState>, private router: Router) {}

  async select(position: Organization | Location) {
    if (!position || !position.id) {
      return;
    }
    if ((position as Location).organizationId) {
      this.setActiveLocation(position as Location);
    } else {
      this.setActiveOrganization(position as Organization);
    }
  }

  setActiveOrganization(organization: Organization): void {
    this.store.dispatch(
      new OrganizationsSetActiveItemIdAction({
        organizationId: organization.id,
        shouldNotify: true,
        saveToDB: true,
      }),
    );
  }

  setActiveLocation(location: Location): void {
    this.store.dispatch(new LocationsSetActiveItemIdAction({ location, shouldNotify: true }));
  }

  goToLocations() {
    this.router.navigate(['/onboarding/locations']);
  }
}
