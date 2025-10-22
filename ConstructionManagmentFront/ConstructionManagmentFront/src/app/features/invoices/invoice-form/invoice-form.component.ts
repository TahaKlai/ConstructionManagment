import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InvoiceService } from '../../../core/services/invoice.service';
import { ProjectService } from '../../../core/services/project.service';
import { SupplierService } from '../../../core/services/supplier.service';
import { BudgetService } from '../../../core/services/budget.service';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <h1 class="mb-4">{{ isEditMode ? 'Edit Invoice' : 'New Invoice' }}</h1>
      
      <div class="card">
        <div class="card-body">
          <form [formGroup]="invoiceForm" (ngSubmit)="onSubmit()">
            <div class="mb-3">
              <label for="invoiceNumber" class="form-label">Invoice Number</label>
              <input type="text" class="form-control" id="invoiceNumber" formControlName="invoiceNumber" required>
              <div *ngIf="invoiceForm.get('invoiceNumber')?.invalid && invoiceForm.get('invoiceNumber')?.touched" class="text-danger">
                Invoice Number is required
              </div>
            </div>
            
            <div class="mb-3">
              <label for="supplier" class="form-label">Supplier</label>
              <select class="form-control" id="supplier" formControlName="supplierId" required>
                <option value="">Select a supplier</option>
                <option *ngFor="let supplier of suppliers" [value]="supplier.id">{{supplier.name}}</option>
              </select>
              <div *ngIf="invoiceForm.get('supplierId')?.invalid && invoiceForm.get('supplierId')?.touched" class="text-danger">
                Supplier is required
              </div>
            </div>
            
            <div class="mb-3">
              <label for="budgetLine" class="form-label">Budget Line</label>
              <select class="form-control" id="budgetLine" formControlName="budgetLineId" required>
                <option value="">Select a budget line</option>
                <option *ngFor="let budgetLine of budgetLines" [value]="budgetLine.id">{{budgetLine.code}} - {{budgetLine.description}}</option>
              </select>
              <div *ngIf="invoiceForm.get('budgetLineId')?.invalid && invoiceForm.get('budgetLineId')?.touched" class="text-danger">
                Budget Line is required
              </div>
            </div>
            
            <div class="mb-3">
              <label for="invoiceDate" class="form-label">Invoice Date</label>
              <input type="date" class="form-control" id="invoiceDate" formControlName="invoiceDate" required>
              <div *ngIf="invoiceForm.get('invoiceDate')?.invalid && invoiceForm.get('invoiceDate')?.touched" class="text-danger">
                Invoice Date is required
              </div>
            </div>
            
            <div class="mb-3">
              <label for="dueDate" class="form-label">Due Date</label>
              <input type="date" class="form-control" id="dueDate" formControlName="dueDate">
            </div>
            
            <div class="mb-3">
              <label for="amount" class="form-label">Amount (€)</label>
              <input type="number" class="form-control" id="amount" formControlName="amount" step="0.01" required>
              <div *ngIf="invoiceForm.get('amount')?.invalid && invoiceForm.get('amount')?.touched" class="text-danger">
                Amount is required and must be greater than 0
              </div>
            </div>
            
            <div class="mb-3">
              <label for="description" class="form-label">Description</label>
              <textarea class="form-control" id="description" formControlName="description" rows="3" required></textarea>
              <div *ngIf="invoiceForm.get('description')?.invalid && invoiceForm.get('description')?.touched" class="text-danger">
                Description is required
              </div>
            </div>
            
            <div class="mb-3">
              <label for="status" class="form-label">Status</label>
              <select class="form-control" id="status" formControlName="status" required>
                <option value="">Select status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="PAID">Paid</option>
                <option value="OVERDUE">Overdue</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <div *ngIf="invoiceForm.get('status')?.invalid && invoiceForm.get('status')?.touched" class="text-danger">
                Status is required
              </div>
            </div>
            
            <div class="mb-3" *ngIf="invoiceForm.get('status')?.value === 'PAID'">
              <label for="paidDate" class="form-label">Paid Date</label>
              <input type="date" class="form-control" id="paidDate" formControlName="paidDate">
            </div>
            
            <div class="d-flex justify-content-between">
              <button type="button" class="btn btn-secondary" routerLink="/invoices">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="invoiceForm.invalid">
                {{ isEditMode ? 'Update' : 'Create' }} Invoice
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class InvoiceFormComponent implements OnInit {
  invoiceForm: FormGroup;
  isEditMode = false;
  invoiceId?: number;
  suppliers: any[] = [];
  budgetLines: any[] = [];
  
  constructor(
    private fb: FormBuilder, 
    private route: ActivatedRoute, 
    private router: Router,
    private invoiceService: InvoiceService,
    private projectService: ProjectService,
    private supplierService: SupplierService,
    private budgetService: BudgetService
  ) {
    this.invoiceForm = this.fb.group({
      invoiceNumber: ['', Validators.required],
      supplierId: ['', Validators.required],
      budgetLineId: ['', Validators.required],
      invoiceDate: ['', Validators.required],
      dueDate: [''],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', Validators.required],
      status: ['PENDING', Validators.required],
      paidDate: ['']
    });
  }
  
  ngOnInit(): void {
    this.invoiceId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.invoiceId;
    
    // Load suppliers and budget lines
    this.loadSuppliers();
    this.loadBudgetLines();
    
    if (this.isEditMode && this.invoiceId) {
      this.loadInvoice();
    }
  }
  
  loadSuppliers(): void {
    this.supplierService.getAllSuppliers().subscribe({
      next: (suppliers) => {
        this.suppliers = suppliers;
      },
      error: (error) => {
        console.error('Error loading suppliers:', error);
      }
    });
  }
  
  loadBudgetLines(): void {
    this.budgetService.getAllBudgetLines().subscribe({
      next: (budgetLines) => {
        this.budgetLines = budgetLines;
      },
      error: (error) => {
        console.error('Error loading budget lines:', error);
      }
    });
  }
  
  loadInvoice(): void {
    this.invoiceService.getInvoiceById(this.invoiceId!).subscribe({
      next: (invoice) => {
        // Convert dates to proper format for form
        const formData = {
          ...invoice,
          invoiceDate: invoice.invoiceDate ? invoice.invoiceDate.split('T')[0] : '',
          dueDate: invoice.dueDate ? invoice.dueDate.split('T')[0] : '',
          paidDate: invoice.paidDate ? invoice.paidDate.split('T')[0] : ''
        };
        this.invoiceForm.patchValue(formData);
      },
      error: (error) => {
        console.error('Error loading invoice:', error);
      }
    });
  }
  
  private formatDateForBackend(dateString: string): string | null {
    if (!dateString) return null;
    // Convert "2025-10-06" to "2025-10-06T00:00:00"
    return dateString + 'T00:00:00';
  }

  onSubmit(): void {
    if (this.invoiceForm.valid) {
      const formValue = this.invoiceForm.value;
      
      // Transform dates to LocalDateTime format for backend
      const invoiceData = {
        ...formValue,
        invoiceDate: this.formatDateForBackend(formValue.invoiceDate),
        dueDate: this.formatDateForBackend(formValue.dueDate),
        paidDate: this.formatDateForBackend(formValue.paidDate)
      };
      
      if (this.isEditMode && this.invoiceId) {
        this.invoiceService.updateInvoice(this.invoiceId, invoiceData).subscribe({
          next: (response) => {
            console.log('Invoice updated successfully:', response);
            this.router.navigate(['/invoices']);
          },
          error: (error) => {
            console.error('Error updating invoice:', error);
          }
        });
      } else {
        this.invoiceService.createInvoice(invoiceData).subscribe({
          next: (response) => {
            console.log('Invoice created successfully:', response);
            this.router.navigate(['/invoices']);
          },
          error: (error) => {
            console.error('Error creating invoice:', error);
          }
        });
      }
    }
  }
}