import { Pipe, PipeTransform } from '@angular/core';
import { Roles } from '@shared/values/roles.array';

@Pipe({
  name: 'formatRole',
})
export class FormatRolePipe implements PipeTransform {
  transform(role: any): any {
    if (!role) {
      console.error(`Role not defined`);
      return 'Role not defined';
    }
    return Roles[role].title;
  }
}
