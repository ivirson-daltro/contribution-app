import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { first } from 'rxjs';
import { ToastService } from '../../../../shared/services/toast.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  form!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  ngOnInit(): void {
    this.buildForm();

    this.form.get('confirmPassword')?.valueChanges.subscribe(() => {
      console.log(this.form);
    });
  }

  buildForm(): void {
    this.form = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  private passwordMatchValidator: ValidatorFn = (
    control: AbstractControl,
  ): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  };

  getTokenFromRoute(): string {
    return this.route.snapshot.params['token'] || '';
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { password } = this.form.getRawValue();
    const token = this.getTokenFromRoute();

    this.authService
      .resetPassword(token, password)
      .pipe(first())
      .subscribe({
        next: () => {
          this.toastService.success(
            'Senha resetada com sucesso. Você já pode fazer login com a nova senha.',
          );

          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          this.toastService.error(
            error.error.error || 'Erro desconhecido',
            'Erro ao resetar senha',
          );
        },
      });
  }
}
