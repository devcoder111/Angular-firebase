import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogComponent } from './dialog-ex/dialog-ex.component';

@Component({
  selector: 'fr-supplier-spending-report',
  templateUrl: './supplier-spending.component.html',
  styleUrls: ['./supplier-spending.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupplierSpendingReportComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  open() {
    this.dialog.open(DialogComponent, { width: '450px', data: {} });
  }
}
