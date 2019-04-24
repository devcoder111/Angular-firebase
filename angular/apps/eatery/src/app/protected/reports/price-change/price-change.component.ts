import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'fr-price-change-report',
  templateUrl: './price-change.component.html',
  styleUrls: ['./price-change.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceChangeReportComponent implements OnInit {
  ngOnInit() {}
}
