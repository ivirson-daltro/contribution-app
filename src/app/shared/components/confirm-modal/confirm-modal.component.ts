import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
})
export class ConfirmModalComponent {
  private readonly dialogRef = inject(MatDialogRef<ConfirmModalComponent>);
  private readonly data = inject(MAT_DIALOG_DATA) as {
    title?: string;
    subtitle?: string;
    confirmLabel?: string;
    cancelLabel?: string;
  };

  get title(): string {
    return this.data.title ?? 'Confirmação';
  }

  get subtitle(): string {
    return this.data.subtitle ?? 'Tem certeza que deseja prosseguir?';
  }

  get confirmLabel(): string {
    return this.data.confirmLabel ?? 'Confirmar';
  }

  get cancelLabel(): string {
    return this.data.cancelLabel ?? 'Cancelar';
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
