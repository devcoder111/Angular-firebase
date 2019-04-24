import { Pipe, PipeTransform } from '@angular/core';
import { InvoiceStatuses } from '@shared/values/invoiceStatuses.array';

@Pipe({
  name: 'invoiceStatusTitleBySlug',
})
export class InvoiceStatusTitleBySlugPipe implements PipeTransform {
  transform(value: any): any {
    const status = InvoiceStatuses[value];
    if (!status) {
      console.error(`Invoice - Unknown "status" value "${value}".`);
      return 'Unknown status';
    }
    return status.title;
  }
}
