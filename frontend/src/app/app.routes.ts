import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'jobs',
    loadChildren: () => import('./features/jobs/jobs.routes').then((m) => m.jobsRoutes),
  },
  {
    path: 'candidates',
    loadChildren: () =>
      import('./features/candidates/candidates.routes').then((m) => m.candidatesRoutes),
  },
  {
    path: 'interviews',
    loadChildren: () =>
      import('./features/interviews/interviews.routes').then((m) => m.interviewsRoutes),
  },
  {
    path: '**',
    redirectTo: 'jobs',
  },
];
