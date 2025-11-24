import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const INVOICES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./invoice-list/invoice-list.component').then(m => m.InvoiceListComponent),
    canActivate: [authGuard],
    title: 'Invoices'
  },
  {
    path: 'new',
    loadComponent: () => import('./invoice-form/invoice-form.component').then(m => m.InvoiceFormComponent),
    canActivate: [authGuard],
    title: 'New Invoice'
  },
  {
    path: ':id',
    loadComponent: () => import('./invoice-details/invoice-details.component').then(m => m.InvoiceDetailsComponent),
    canActivate: [authGuard],
    title: 'Invoice Details'
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./invoice-form/invoice-form.component').then(m => m.InvoiceFormComponent),
    canActivate: [authGuard],
    title: 'Edit Invoice'
  }
];