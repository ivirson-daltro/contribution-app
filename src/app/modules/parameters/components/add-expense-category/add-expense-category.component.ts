import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ToastService } from '../../../../shared/services/toast.service';
import { ExpenseCategory } from '../../models/parameters.models';
import { ParametersService } from '../../services/parameters.service';

@Component({
  selector: 'app-add-expense-category',
  imports: [MatDialogModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './add-expense-category.component.html',
  styleUrls: ['./add-expense-category.component.scss'],
})
export class AddExpenseCategoryComponent implements OnInit {
  private readonly fb = new FormBuilder();
  private readonly parametersService = inject(ParametersService);
  private readonly toastService = inject(ToastService);

  form!: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AddExpenseCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ExpenseCategory | null,
  ) {}

  ngOnInit(): void {
    this.buildForm();

    if (this.data) {
      this.form.patchValue({
        description: this.data.description,
      });
    }
  }

  buildForm(): void {
    this.form = this.fb.group({
      description: [null, Validators.required],
    });
  }

  submit(): void {
    const payload: ExpenseCategory = this.form.getRawValue();

    if (this.data) {
      payload.id = this.data.id;
      this.updateExpenseCategory(payload);
    } else {
      this.saveExpenseCategory(payload);
    }
  }

  saveExpenseCategory(payload: ExpenseCategory): void {
    this.parametersService.createExpenseCategory(payload).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.toastService.error('Erro ao salvar categoria de despesa. Por favor, tente novamente.');
      },
    });
  }

  updateExpenseCategory(payload: ExpenseCategory): void {
    this.parametersService.updateExpenseCategory(this.data?.id as string, payload).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.toastService.error(
          'Erro ao atualizar categoria de despesa. Por favor, tente novamente.',
        );
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
