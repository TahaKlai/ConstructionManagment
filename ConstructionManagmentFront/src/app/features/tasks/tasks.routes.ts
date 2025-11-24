import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const TASKS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./task-list/task-list.component').then(m => m.TaskListComponent),
    canActivate: [authGuard],
    title: 'Tasks'
  },
  {
    path: 'new',
    loadComponent: () => import('./task-form/task-form.component').then(m => m.TaskFormComponent),
    canActivate: [authGuard],
    title: 'New Task'
  },
  {
    path: ':id',
    loadComponent: () => import('./task-details/task-details.component').then(m => m.TaskDetailsComponent),
    canActivate: [authGuard],
    title: 'Task Details'
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./task-form/task-form.component').then(m => m.TaskFormComponent),
    canActivate: [authGuard],
    title: 'Edit Task'
  }
];