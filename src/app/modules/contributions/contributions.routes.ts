import { Routes } from '@angular/router';

export const CONTRIBUTIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./contributions.component').then((m) => m.ContributionsComponent),
  },
];
