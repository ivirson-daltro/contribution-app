import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { first } from 'rxjs';
import { ToastService } from '../../../../shared/services/toast.service';
import { User } from '../../../auth/models/user.model';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-add-users',
  imports: [ReactiveFormsModule, MatDialogModule, MatIconModule],
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss'],
})
export class AddUsersComponent implements OnInit {
  private readonly usersService = inject(UsersService);
  private readonly toastService = inject(ToastService);

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User | null,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    if (this.data) {
      this.form.patchValue({
        name: this.data.name ?? '',
        email: this.data.email ?? '',
      });
    }
  }

  buildForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['', [Validators.required]],
    });
  }

  submit(): void {
    const userData = this.form.getRawValue();

    if (this.data && this.data.id) {
      this.updateUser(this.data.id, userData);
    } else {
      this.saveUser(userData);
    }
  }

  saveUser(userData: User): void {
    this.usersService
      .saveUser(userData)
      .pipe(first())
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.toastService.success('Usuário cadastrado com sucesso.');
        },
        error: (error) => {
          this.toastService.error(error?.error?.error ?? 'Erro ao cadastrar usuário.');
        },
      });
  }

  updateUser(id: string, userData: User): void {
    this.usersService
      .updateUser(id, userData)
      .pipe(first())
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.toastService.success('Usuário atualizado com sucesso.');
        },
        error: (error) => {
          this.toastService.error(error?.error?.error ?? 'Erro ao atualizar usuário.');
        },
      });
  }

  close(): void {
    this.dialogRef.close();
  }
}
