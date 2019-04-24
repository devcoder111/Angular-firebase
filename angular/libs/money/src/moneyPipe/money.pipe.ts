import { Pipe, PipeTransform } from '@angular/core';
import { convertMoneyModelToView } from '@shared/helpers/convertMoney/convertMoney.helper';

@Pipe({
  name: 'money',
})
export class MoneyPipe implements PipeTransform {
  transform(value: number): string {
    return '$' + (value ? convertMoneyModelToView(value) : 0);
  }
}
