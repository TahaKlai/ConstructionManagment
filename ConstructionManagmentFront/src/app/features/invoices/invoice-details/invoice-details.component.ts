import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Invoice } from '../../../core/models/project.model';
import { InvoiceService } from '../../../core/services/invoice.service';

@Component({
  selector: 'app-invoice-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Invoice Details</h1>
        <div>
          <button class="btn btn-warning me-2" [routerLink]="['/invoices', invoiceId, 'edit']">Edit</button>
          <button class="btn btn-danger" (click)="deleteInvoice()">Delete</button>
        </div>
      </div>
      
      @if (loading) {
        <div class="text-center py-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      } @else if (!invoice) {
        <div class="alert alert-warning">
          Invoice not found
        </div>
      } @else {
        <div class="card">
          <div class="card-header d-flex justify-content-between">
            <span>Invoice #{{ invoice.id }}</span>
            <span class="badge" [ngClass]="getStatusClass(invoice.status)">
              {{ invoice.status }}
            </span>
          </div>
          <div class="card-body">
            <div class="row mb-4">
              <div class="col-md-6">
                <h5 class="text-muted">Invoice Details</h5>
                <p><strong>Invoice Number:</strong> {{ invoice.invoiceNumber }}</p>
                <p><strong>Date:</strong> {{ formatDate(invoice.invoiceDate) }}</p>
                <p><strong>Due Date:</strong> {{ formatDate(invoice.dueDate) }}</p>
                <p><strong>Amount:</strong> {{ invoice.amount | currency:'EUR' }}</p>
                <p><strong>Description:</strong> {{ invoice.description }}</p>
              </div>
              <div class="col-md-6">
                <h5 class="text-muted">Related Information</h5>
                <p><strong>Supplier:</strong> {{ invoice.supplier?.name || 'Unknown' }}</p>
                <p><strong>Budget Line:</strong> {{ invoice.budgetLine?.code || 'N/A' }}</p>
                <p *ngIf="invoice.status === 'PAID' && invoice.paidDate">
                  <strong>Paid Date:</strong> {{ formatDate(invoice.paidDate) }}
                </p>
              </div>
            </div>
            
            <div class="d-grid gap-2 d-md-flex justify-content-md-start">
              <button class="btn btn-secondary" routerLink="/invoices">Back to List</button>
              @if (invoice.status !== 'PAID') {
                <button class="btn btn-success" (click)="markAsPaid()">Mark as Paid</button>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: []
})
export class InvoiceDetailsComponent implements OnInit {
  invoiceId?: number;
  invoice?: Invoice;
  loading = true;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private invoiceService: InvoiceService
  ) {}
  
  ngOnInit(): void {
    this.invoiceId = Number(this.route.snapshot.paramMap.get('id'));
    
    this.invoiceService.getInvoiceById(this.invoiceId!).subscribe({
      next: (invoice) => {
        this.invoice = invoice;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading invoice:', error);
        this.loading = false;
      }
    });
  }
  
  markAsPaid(): void {
    if (this.invoice && this.invoice.id) {
      this.invoiceService.updatePaymentStatus(this.invoice.id, true).subscribe({
        next: (updatedInvoice) => {
          this.invoice = updatedInvoice;
          console.log('Invoice marked as paid:', updatedInvoice);
        },
        error: (error) => {
          console.error('Error updating payment status:', error);
        }
      });
    }
  }
  
  deleteInvoice(): void {
    if (confirm('Are you sure you want to delete this invoice?')) {
      this.invoiceService.deleteInvoice(this.invoiceId!).subscribe({
        next: () => {
          console.log('Invoice deleted successfully');
          this.router.navigate(['/invoices']);
        },
        error: (error) => {
          console.error('Error deleting invoice:', error);
        }
      });
    }
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
}