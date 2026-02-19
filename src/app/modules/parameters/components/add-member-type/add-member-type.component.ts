import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ToastService } from '../../../../shared/services/toast.service';
import { MemberType } from '../../models/parameters.models';
import { ParametersService } from '../../services/parameters.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-member-type',
  imports: [MatDialogModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './add-member-type.component.html',
  styleUrls: ['./add-member-type.component.scss'],
})
export class AddMemberTypeComponent implements OnInit {
  private readonly fb = new FormBuilder();
  private readonly parametersService = inject(ParametersService);
  private readonly toastService = inject(ToastService);

  form!: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AddMemberTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MemberType | null,
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
    const payload: MemberType = this.form.getRawValue();

    if (this.data) {
      payload.id = this.data.id;
      this.updateMemberType(payload);
    } else {
      this.saveMemberType(payload);
    }
  }

  saveMemberType(payload: MemberType): void {
    this.parametersService.createMemberType(payload).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.toastService.error('Erro ao salvar tipo de membro. Por favor, tente novamente.');
      },
    });
  }

  updateMemberType(payload: MemberType): void {
    this.parametersService.updateMemberType(this.data?.id as string, payload).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.toastService.error('Erro ao atualizar tipo de membro. Por favor, tente novamente.');
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
