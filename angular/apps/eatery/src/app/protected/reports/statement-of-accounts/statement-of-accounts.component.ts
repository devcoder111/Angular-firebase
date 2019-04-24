import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'fr-statement-of-accounts-report',
  templateUrl: './statement-of-accounts.component.html',
  styleUrls: ['./statement-of-accounts.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatementOfAccountsReportComponent implements OnInit {
  ngOnInit() {}
}
