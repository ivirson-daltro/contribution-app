import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ToastService } from '../../../../shared/services/toast.service';
import { PaymentMethod } from '../../models/parameters.models';
import { ParametersService } from '../../services/parameters.service';

@Component({
  selector: 'app-add-payment-method',
  imports: [MatDialogModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './add-payment-method.component.html',
  styleUrls: ['./add-payment-method.component.scss'],
})
export class AddPaymentMethodComponent implements OnInit {
  private readonly fb = new FormBuilder();
  private readonly parametersService = inject(ParametersService);
  private readonly toastService = inject(ToastService);

  form!: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AddPaymentMethodComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PaymentMethod | null,
  ) {}

  ngOnInit(): void {
    this.buildForm();

    if (this.data) {
      this.form.patchValue({
        type: this.data.type,
        description: this.data.description,
      });
    }
  }

  buildForm(): void {
    this.form = this.fb.group({
      type: [null, Validators.required],
      description: [null, Validators.required],
    });
  }

  submit(): void {
    const payload: PaymentMethod = this.form.getRawValue();

    if (this.data) {
      payload.id = this.data.id;
      this.updatePaymentMethod(payload);
    } else {
      this.savePaymentMethod(payload);
    }
  }

  savePaymentMethod(payload: PaymentMethod): void {
    this.parametersService.createPaymentMethod(payload).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.toastService.error('Erro ao salvar método de pagamento. Por favor, tente novamente.');
      },
    });
  }

  updatePaymentMethod(payload: PaymentMethod): void {
    this.parametersService.updatePaymentMethod(this.data?.id as string, payload).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.toastService.error(
          'Erro ao atualizar método de pagamento. Por favor, tente novamente.',
        );
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
