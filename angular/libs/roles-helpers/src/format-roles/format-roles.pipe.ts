import { Pipe, PipeTransform } from '@angular/core';
import { Roles } from '@shared/values/roles.array';

@Pipe({
  name: 'formatRoles',
})
export class FormatRolesPipe implements PipeTransform {
  transform(users: any): any {
    if (!users) {
      console.error(`Users not defined`);
      return 'Users not defined';
    }
    return Object.keys(users)
      .map(userId => `${userId} (${Roles[users[userId]].title})`)
      .join(', ');
  }
}
