import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class NotImplementedService {
  constructor(private snackbar: MatSnackBar) {}

  showSnackbar(): void {
    this.snackbar.open('This feature is not implemented yet', '', {
      duration: 2000,
    });
  }
}
