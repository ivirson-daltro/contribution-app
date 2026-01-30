import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../modules/auth/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);
  const token = authService.getToken();

  const isAuthRequest = req.url.includes('/auth/login');

  // Não adiciona token na requisição de login
  if (isAuthRequest) {
    return next(req);
  }

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
        toastService.error('Sessão expirada. Faça login novamente.');

        router.navigate(['/auth/login'], {
          queryParams: { returnUrl: router.url },
        });
      } else if (error.status === 403) {
        toastService.warning('Você não tem permissão para acessar este recurso.');
      }

      return throwError(() => error);
    }),
  );
};
