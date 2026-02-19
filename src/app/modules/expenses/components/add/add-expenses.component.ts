import { AsyncPipe } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective } from 'ngx-mask';
import { Observable } from 'rxjs';
import { ToastService } from '../../../../shared/services/toast.service';
import { UtilsService } from '../../../../shared/services/utils.service';
import { Expense } from '../../models/expense.model';
import { ExpensesService } from '../../services/expenses.service';
import { TipoAnexo } from '../../../../shared/constants/tipo-anexo.enum';
import { ExpenseCategory } from '../../../parameters/models/parameters.models';

@Component({
  selector: 'app-add-expenses',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    AsyncPipe,
    NgxMaskDirective,
  ],
  templateUrl: './add-expenses.component.html',
  styleUrl: './add-expenses.component.scss',
})
export class AddExpensesComponent implements OnInit {
  selectedFile: File | null = null;
  private readonly expensesService = inject(ExpensesService);
  public readonly utilsService = inject(UtilsService);
  public readonly toastService = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  form!: FormGroup;

  categories$: Observable<ExpenseCategory[]> = this.expensesService.getCategories();

  today = new Date();
  maxDate: string = this.today.toISOString().substring(0, 10);

  constructor(
    private dialogRef: MatDialogRef<AddExpensesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Expense | null,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    if (this.data) {
      this.form.patchValue({
        value: this.data.value,
        categoryId: this.data.categoryId,
        date: this.data.date
          ? this.data.date.substring(0, 10)
          : this.today.toISOString().substring(0, 10),
        notes: this.data.notes || '',
      });
    }
  }

  buildForm(): void {
    this.form = this.fb.group({
      value: [null, Validators.required],
      categoryId: ['', Validators.required],
      date: [this.today.toISOString().substring(0, 10), Validators.required],
      notes: [''],
    });
  }

  submit(): void {
    const raw = this.form.getRawValue();
    const payload: Expense = {
      ...raw,
      value: typeof raw.value === 'string' ? parseFloat(raw.value.replace(',', '.')) : raw.value,
      attachmentUrl: this.data?.attachmentUrl ?? null,
    };

    const formData = new FormData();
    formData.append('expense', JSON.stringify(payload));

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    if (this.data) {
      formData.append('id', this.data.id);
      this.updateExpense(formData, this.data.id);
    } else {
      this.saveExpense(formData);
    }
  }

  saveExpense(formData: FormData): void {
    this.expensesService.saveExpense(formData).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.toastService.error('Erro ao salvar despesa. Por favor, tente novamente.');
      },
    });
  }

  updateExpense(formData: FormData, id: string): void {
    this.expensesService.updateExpense(formData, id).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.toastService.error('Erro ao atualizar despesa. Por favor, tente novamente.');
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  async downloadAttachment(url: string): Promise<void> {
    this.utilsService.downloadAttachment(url, TipoAnexo.DESPESA);
  }

  close(): void {
    this.dialogRef.close();
  }
}
