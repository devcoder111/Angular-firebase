import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'fr-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ConfirmDialogComponent>) {}

  ok() {
    this.dialogRef.close(true);
  }

  isAnswerFilled(): boolean {
    return true;
  }
}

@Component({
  selector: 'fr-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogWithTextComponent extends ConfirmDialogComponent {
  textAreaValue: string;

  ok() {
    if (this.data.isAnswerRequired && !this.textAreaValue) {
      return;
    }
    this.dialogRef.close({ result: true, text: this.textAreaValue });
  }

  onAnswerTextChanged(answer: string): void {
    this.textAreaValue = answer;
  }

  isAnswerFilled(): boolean {
    return !!this.textAreaValue;
  }
}
