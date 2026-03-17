import { Routes } from '@angular/router';

export const interviewsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./interview-list/interview-list.component').then((m) => m.InterviewListComponent),
  },
];
