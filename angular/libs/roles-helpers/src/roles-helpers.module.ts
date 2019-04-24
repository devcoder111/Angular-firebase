import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormatRolePipe } from '@libs/roles-helpers/src/format-role/format-role.pipe';
import { FormatRolesPipe } from '@libs/roles-helpers/src/format-roles/format-roles.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [FormatRolePipe, FormatRolesPipe],
  exports: [FormatRolePipe, FormatRolesPipe],
})
export class RolesHelpersModule {}
