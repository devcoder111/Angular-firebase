import { Pipe, PipeTransform } from '@angular/core';
import { Location } from '@shared/types/location.interface';
import { Organization } from '@shared/types/organization.interface';
import { ActivePosition } from './activePosition.inteface';

@Pipe({
  name: 'organizationLocationSelector',
})
export class OrganizationLocationSelectorPipe implements PipeTransform {
  transform(position: ActivePosition, organizations: Organization[], locations: Location[]): Organization | Location {
    return position.type === 'organization'
      ? organizations.find(o => o.id === position.id)
      : locations.find(l => l.id === position.id);
  }
}
