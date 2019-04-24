import { Pipe, PipeTransform } from '@angular/core';
import { OrderStatuses } from '@shared/values/orderStatuses.array';

@Pipe({
  name: 'orderStatusTitleBySlug',
})
export class OrderStatusTitleBySlugPipe implements PipeTransform {
  transform(value: any): any {
    const status = OrderStatuses[value];
    if (!status) {
      console.error(`Order - Unknown "status" value "${value}".`);
      return 'Unknown status';
    }
    return status.title;
  }
}
