import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent, ConfirmDialogWithTextComponent } from './confirm-dialog.component';

@Injectable()
export class ConfirmDialogService {
  constructor(public dialog: MatDialog) {}

  show(title = 'Are you sure?'): Promise<boolean> {
    const data: ConfirmDialogPromptOptions = { title, type: 'confirm' };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '330px',
      data,
    });
    return dialogRef
      .afterClosed()
      .toPromise()
      .then(result => !!result);
  }

  async prompt(data: ConfirmDialogPromptOptions): Promise<{ result: boolean; text: string }> {
    data.type = 'prompt';
    const dialogRef = this.dialog.open(ConfirmDialogWithTextComponent, {
      width: '330px',
      data,
    });
    return dialogRef
      .afterClosed()
      .toPromise()
      .then(result => {
        return result;
      });
  }
}

export interface ConfirmDialogPromptOptions {
  title: string;
  type?: 'confirm' | 'prompt';
  isAnswerRequired?: boolean;
  placeholder?: string;
}
