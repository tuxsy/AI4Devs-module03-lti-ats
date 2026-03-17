import { Routes } from '@angular/router';

export const candidatesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./candidate-list/candidate-list.component').then((m) => m.CandidateListComponent),
  },
];
