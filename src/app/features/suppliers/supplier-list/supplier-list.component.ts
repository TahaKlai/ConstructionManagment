import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Supplier } from '../../../core/models/project.model';
import { SupplierService } from '../../../core/services/supplier.service';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-4">
      <h1 class="mb-4">Suppliers</h1>
      <div class="d-flex justify-content-between mb-3">
        <button class="btn btn-primary" routerLink="/suppliers/new">Add New Supplier</button>
        <div class="input-group w-50">
          <input type="text" class="form-control" placeholder="Search suppliers...">
          <button class="btn btn-outline-secondary" type="button">Search</button>
        </div>
      </div>
      
      <div class="card">
        <div class="card-body">
          @if (loading) {
            <div class="text-center py-5">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          } @else if (suppliers.length === 0) {
            <div class="text-center py-5">
              <p>No suppliers found</p>
            </div>
          } @else {
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Contact Person</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (supplier of suppliers; track supplier.id) {
                    <tr>
                      <td>
                        <a [routerLink]="['/suppliers', supplier.id]">{{ supplier.name }}</a>
                      </td>
                      <td>{{ supplier.contactPerson }}</td>
                      <td>{{ supplier.email }}</td>
                      <td>{{ supplier.phone }}</td>
                      <td>
                        <a [routerLink]="['/suppliers', supplier.id]" class="btn btn-sm btn-info me-2">View</a>
                        <a [routerLink]="['/suppliers', supplier.id, 'edit']" class="btn btn-sm btn-warning">Edit</a>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .table {
      margin-bottom: 0;
    }
  `]
})
export class SupplierListComponent implements OnInit {
  suppliers: Supplier[] = [];
  loading = true;
  
  constructor(
    private supplierService: SupplierService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.loading = true;
    console.log('Loading suppliers from service...');
    
    this.supplierService.getAllSuppliers().subscribe({
      next: (suppliers) => {
        this.suppliers = suppliers;
        this.loading = false;
        console.log('Suppliers loaded from service:', suppliers.length);
        console.log('First supplier:', suppliers[0]?.name);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading suppliers:', error);
        this.suppliers = [];
        this.loading = false;
      }
    });
  }
}