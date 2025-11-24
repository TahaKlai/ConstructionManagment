import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'projects',
    loadChildren: () => import('./features/projects/projects.routes').then(m => m.PROJECTS_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'suppliers',
    loadChildren: () => import('./features/suppliers/suppliers.routes').then(m => m.SUPPLIERS_ROUTES),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'invoices',
    loadChildren: () => import('./features/invoices/invoices.routes').then(m => m.INVOICES_ROUTES),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'tasks',
    loadChildren: () => import('./features/tasks/tasks.routes').then(m => m.TASKS_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'workedhours',
    loadChildren: () => import('./features/workedhours/workedhours.routes').then(m => m.WORKEDHOURS_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'admin/users',
    redirectTo: 'dashboard' // Temporary redirect until we create the actual component
  },
  {
    path: 'admin/reports',
    redirectTo: 'dashboard' // Temporary redirect until we create the actual component
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
