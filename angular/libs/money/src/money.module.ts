import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MoneyPipe } from '@libs/money/src/moneyPipe/money.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [MoneyPipe],
  exports: [MoneyPipe],
})
export class MoneyModule {}
