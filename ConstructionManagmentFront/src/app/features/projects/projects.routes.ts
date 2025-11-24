import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const PROJECTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./project-list/project-list.component').then(m => m.ProjectListComponent),
    canActivate: [authGuard],
    title: 'Projects'
  },
  {
    path: 'new',
    loadComponent: () => import('./project-form/project-form.component').then(m => m.ProjectFormComponent),
    canActivate: [authGuard],
    title: 'New Project'
  },
  {
    path: ':id',
    loadComponent: () => import('./project-details/project-details.component').then(m => m.ProjectDetailsComponent),
    canActivate: [authGuard],
    title: 'Project Details'
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./project-form/project-form.component').then(m => m.ProjectFormComponent),
    canActivate: [authGuard],
    title: 'Edit Project'
  },
  {
    path: ':id/import',
    loadComponent: () => import('./project-import/project-import.component').then(m => m.ProjectImportComponent),
    canActivate: [authGuard],
    title: 'Import Project Data'
  }
];