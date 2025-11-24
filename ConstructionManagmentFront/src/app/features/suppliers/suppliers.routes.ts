import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const SUPPLIERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./supplier-list/supplier-list.component').then(m => m.SupplierListComponent),
    canActivate: [authGuard],
    title: 'Suppliers'
  },
  {
    path: 'new',
    loadComponent: () => import('./supplier-form/supplier-form.component').then(m => m.SupplierFormComponent),
    canActivate: [authGuard],
    title: 'New Supplier'
  },
  {
    path: ':id',
    loadComponent: () => import('./supplier-details/supplier-details.component').then(m => m.SupplierDetailsComponent),
    canActivate: [authGuard],
    title: 'Supplier Details'
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./supplier-form/supplier-form.component').then(m => m.SupplierFormComponent),
    canActivate: [authGuard],
    title: 'Edit Supplier'
  }
];