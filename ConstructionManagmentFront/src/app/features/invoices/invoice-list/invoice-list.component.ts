import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Invoice } from '../../../core/models/project.model';
import { InvoiceService } from '../../../core/services/invoice.service';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-4">
      <h1 class="mb-4">Invoices</h1>
      <div class="d-flex justify-content-between mb-3">
        <button class="btn btn-primary" routerLink="/invoices/new">Add New Invoice</button>
        <div class="input-group w-50">
          <input type="text" class="form-control" placeholder="Search invoices...">
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
          } @else if (invoices.length === 0) {
            <div class="text-center py-5">
              <p>No invoices found</p>
            </div>
          } @else {
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Date</th>
                    <th>Supplier</th>
                    <th>Amount</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (invoice of invoices; track invoice.id) {
                    <tr>
                      <td>{{ invoice.invoiceNumber }}</td>
                      <td>{{ formatDate(invoice.invoiceDate) }}</td>
                      <td>{{ invoice.supplier?.name || 'Unknown' }}</td>
                      <td>{{ invoice.amount | currency:'EUR' }}</td>
                      <td>{{ formatDate(invoice.dueDate) }}</td>
                      <td>
                        <span class="badge" [ngClass]="getStatusClass(invoice.status)">
                          {{ invoice.status }}
                        </span>
                      </td>
                      <td>
                        <a [routerLink]="['/invoices', invoice.id]" class="btn btn-sm btn-info me-2">View</a>
                        <a [routerLink]="['/invoices', invoice.id, 'edit']" class="btn btn-sm btn-warning me-2">Edit</a>
                        <button class="btn btn-sm btn-danger" (click)="deleteInvoice(invoice.id!)">Delete</button>
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
export class InvoiceListComponent implements OnInit {
  invoices: Invoice[] = [];
  loading = true;
  
  constructor(
    private invoiceService: InvoiceService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.loading = true;
    console.log('Loading invoices from service...');
    
    this.invoiceService.getAllInvoices().subscribe({
      next: (invoices) => {
        this.invoices = invoices;
        this.loading = false;
        console.log('Invoices loaded from service:', invoices.length);
        console.log('First invoice:', invoices[0]?.description);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading invoices:', error);
        this.invoices = [];
        this.loading = false;
      }
    });
  }
  
  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  }
  
  getStatusClass(status: string): string {
    switch (status) {
      case 'PAID':
        return 'bg-success';
      case 'APPROVED':
        return 'bg-info';
      case 'PENDING':
        return 'bg-warning';
      case 'OVERDUE':
        return 'bg-danger';
      case 'CANCELLED':
        return 'bg-secondary';
      default:
        return 'bg-light';
    }
  }
  
  deleteInvoice(id: number): void {
    if (confirm('Are you sure you want to delete this invoice?')) {
      this.invoiceService.deleteInvoice(id).subscribe({
        next: () => {
          console.log('Invoice deleted successfully');
          this.loadInvoices(); // Reload the list
        },
        error: (error) => {
          console.error('Error deleting invoice:', error);
        }
      });
    }
  }
}