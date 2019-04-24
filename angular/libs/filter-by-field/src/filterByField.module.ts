import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FilterByFieldPipe } from '@libs/filter-by-field/src/filterByField/filterByField.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [FilterByFieldPipe],
  exports: [FilterByFieldPipe],
})
export class FilterByFieldModule {}
