import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly defaultConfig: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
  };

  constructor(private snackBar: MatSnackBar) {}

  success(message: string, title: string = 'Sucesso'): void {
    this.open(`${title}: ${message}`, ['toast-success']);
  }

  error(message: string, title: string = 'Erro'): void {
    this.open(`${title}: ${message}`, ['toast-error']);
  }

  warning(message: string, title: string = 'Atenção'): void {
    this.open(`${title}: ${message}`, ['toast-warning']);
  }

  private open(message: string, panelClass: string[]): void {
    this.snackBar.open(message, undefined, {
      ...this.defaultConfig,
      panelClass,
    });
  }
}
