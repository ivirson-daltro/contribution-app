import { Routes } from '@angular/router';
import { authGuard } from '../auth/guards/auth.guard';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./home.component').then((m) => m.HomeComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'contributions',
        loadChildren: () =>
          import('./../contributions/contributions.routes').then((m) => m.CONTRIBUTIONS_ROUTES),
      },
      {
        path: 'members',
        loadChildren: () => import('./../members/members.routes').then((m) => m.MEMBERS_ROUTES),
      },
    ],
  },
];
