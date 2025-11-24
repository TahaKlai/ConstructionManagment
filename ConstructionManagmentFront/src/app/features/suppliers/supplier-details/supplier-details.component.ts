import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Supplier } from '../../../core/models/project.model';
import { SupplierService } from '../../../core/services/supplier.service';

@Component({
  selector: 'app-supplier-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Supplier Details</h1>
        <div>
          <button class="btn btn-warning me-2" [routerLink]="['/suppliers', supplierId, 'edit']">Edit</button>
          <button class="btn btn-danger" (click)="deleteSupplier()">Delete</button>
        </div>
      </div>
      
      @if (loading) {
        <div class="text-center py-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      } @else if (!supplier) {
        <div class="alert alert-warning">
          Supplier not found
        </div>
      } @else {
        <div class="card mb-4">
          <div class="card-header">
            <h2 class="mb-0">{{ supplier.name }}</h2>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <p><strong>Contact Person:</strong> {{ supplier.contactPerson }}</p>
                <p><strong>Email:</strong> {{ supplier.email }}</p>
                <p><strong>Phone:</strong> {{ supplier.phone }}</p>
              </div>
              <div class="col-md-6">
                <p><strong>Address:</strong> {{ supplier.address }}</p>
                <p><strong>Tax ID:</strong> {{ supplier.taxId }}</p>
                <p><strong>Category:</strong> {{ supplier.category }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Related Invoices -->
        <div class="card mb-4">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Related Invoices</h5>
            <button class="btn btn-sm btn-primary" routerLink="/invoices/new">New Invoice</button>
          </div>
          <div class="card-body">
            @if (relatedInvoices.length === 0) {
              <p>No invoices found for this supplier</p>
            } @else {
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Date</th>
                      <th>Project</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (invoice of relatedInvoices; track invoice.id) {
                      <tr>
                        <td>{{ invoice.id }}</td>
                        <td>{{ invoice.date }}</td>
                        <td>{{ invoice.projectId }}</td>
                        <td>{{ invoice.amount | currency:'EUR' }}</td>
                        <td>
                          <span class="badge" [ngClass]="invoice.paid ? 'bg-success' : 'bg-warning'">
                            {{ invoice.paid ? 'Paid' : 'Pending' }}
                          </span>
                        </td>
                        <td>
                          <a [routerLink]="['/invoices', invoice.id]" class="btn btn-sm btn-info">View</a>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>
        </div>
        
        <button class="btn btn-secondary" routerLink="/suppliers">Back to Suppliers</button>
      }
    </div>
  `,
  styles: []
})
export class SupplierDetailsComponent implements OnInit {
  supplierId?: number;
  supplier?: Supplier;
  loading = true;
  relatedInvoices: any[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supplierService: SupplierService
  ) {}
  
  ngOnInit(): void {
    this.supplierId = Number(this.route.snapshot.paramMap.get('id'));
    
    // Mock data for now
    setTimeout(() => {
      this.supplier = {
        id: this.supplierId,
        name: 'Dutch Building Supplies',
        address: 'Keizersgracht 123, Amsterdam',
        phone: '+31 20 123 4567',
        email: 'info@dbsupplies.nl',
        contactPerson: 'Jan de Vries',
        taxId: 'NL123456789B01',
        category: 'Materials'
      };
      
      this.relatedInvoices = [
        {
          id: 1,
          projectId: 1,
          supplierId: this.supplierId,
          date: '2023-09-15',
          amount: 4850,
          paid: true,
          description: 'Building materials'
        },
        {
          id: 3,
          projectId: 2,
          supplierId: this.supplierId,
          date: '2023-10-10',
          amount: 5300,
          paid: false,
          description: 'Foundation materials'
        }
      ];
      
      this.loading = false;
    }, 1000);
  }
  
  deleteSupplier(): void {
    if (confirm('Are you sure you want to delete this supplier?')) {
      // In a real app, this would call the service to delete the supplier
      console.log('Deleting supplier:', this.supplierId);
      this.router.navigate(['/suppliers']);
    }
  }
}