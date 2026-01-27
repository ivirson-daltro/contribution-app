import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-weekly-report-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './weekly-report-dialog.html',
  styleUrl: './weekly-report-dialog.scss',
})
export class WeeklyReportDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<WeeklyReportDialogComponent>);
  private readonly fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
  });

  close(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.form.value);
  }
}
