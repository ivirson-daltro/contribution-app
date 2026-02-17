import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserRoles } from '../../users/constants/user-roles.enum';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  // Recupera usuário logado
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  if (!user) {
    authService.logout();
    router.navigate(['/auth/login']);
    return false;
  }

  // Define permissões por rota (exemplo)
  const routePermissions: { [key: string]: string[] } = {
    '/': [
      UserRoles.ADMIN,
      UserRoles.TREASURER,
      UserRoles.SECRETARY,
      UserRoles.PRESIDENT,
      UserRoles.FISCAL,
    ],
    '/members': [
      UserRoles.ADMIN,
      UserRoles.TREASURER,
      UserRoles.SECRETARY,
      UserRoles.PRESIDENT,
      UserRoles.FISCAL,
    ],
    '/users': [UserRoles.ADMIN],
    '/contributions': [UserRoles.ADMIN, UserRoles.FISCAL, UserRoles.TREASURER, UserRoles.PRESIDENT],
    '/expenses': [UserRoles.ADMIN, UserRoles.FISCAL, UserRoles.TREASURER, UserRoles.PRESIDENT],
  };

  // Descobre o path base da rota
  const url = state.url.split('?')[0];
  const basePath = url.split('/')[1] ? `/${url.split('/')[1]}` : '/';
  const allowedRoles = routePermissions[basePath] || [
    UserRoles.ADMIN,
    UserRoles.TREASURER,
    UserRoles.SECRETARY,
    UserRoles.PRESIDENT,
    UserRoles.FISCAL,
  ];

  if (!allowedRoles.includes(user.role)) {
    // Redireciona se não tiver permissão
    router.navigate(['/']);
    return false;
  }

  return true;
};
