import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number, ellipsis = '...') {
    if (!value) {
      return value;
    }
    if (value.length > limit) {
      return `${value.substr(0, limit)}${ellipsis}`;
    }
    return value;
  }
}
