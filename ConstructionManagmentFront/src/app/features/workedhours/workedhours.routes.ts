import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const WORKEDHOURS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./workedhours-list/workedhours-list.component').then(m => m.WorkedHoursListComponent),
    canActivate: [authGuard],
    title: 'Worked Hours'
  },
  {
    path: 'project/:projectId',
    loadComponent: () => import('./workedhours-entry/workedhours-entry.component').then(m => m.WorkedHoursEntryComponent),
    canActivate: [authGuard],
    title: 'Enter Worked Hours'
  },
  {
    path: 'project/:projectId/week/:weekNumber',
    loadComponent: () => import('./workedhours-entry/workedhours-entry.component').then(m => m.WorkedHoursEntryComponent),
    canActivate: [authGuard],
    title: 'Enter Worked Hours for Week'
  },
  {
    path: 'import',
    loadComponent: () => import('./workedhours-import/workedhours-import.component').then(m => m.WorkedHoursImportComponent),
    canActivate: [authGuard],
    title: 'Import Worked Hours'
  }
];