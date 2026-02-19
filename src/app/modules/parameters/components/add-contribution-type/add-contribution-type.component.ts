import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ToastService } from '../../../../shared/services/toast.service';
import { ContributionType } from '../../models/parameters.models';
import { ParametersService } from '../../services/parameters.service';

@Component({
  selector: 'app-add-contribution-type',
  imports: [MatDialogModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './add-contribution-type.component.html',
  styleUrl: './add-contribution-type.component.scss',
})
export class AddContributionTypeComponent implements OnInit {
  private readonly fb = new FormBuilder();
  private readonly parametersService = inject(ParametersService);
  private readonly toastService = inject(ToastService);

  form!: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AddContributionTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ContributionType | null,
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
    const payload: ContributionType = this.form.getRawValue();

    if (this.data) {
      payload.id = this.data.id;
      this.updateContributionType(payload);
    } else {
      this.saveContributionType(payload);
    }
  }

  saveContributionType(payload: ContributionType): void {
    this.parametersService.createContributionType(payload).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.toastService.error('Erro ao salvar tipo de contribuição. Por favor, tente novamente.');
      },
    });
  }

  updateContributionType(payload: ContributionType): void {
    this.parametersService.updateContributionType(this.data?.id as string, payload).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.toastService.error(
          'Erro ao atualizar tipo de contribuição. Por favor, tente novamente.',
        );
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
