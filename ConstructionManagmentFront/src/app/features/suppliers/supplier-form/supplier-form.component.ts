import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupplierService } from '../../../core/services/supplier.service';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <h1 class="mb-4">{{ isEditMode ? 'Edit Supplier' : 'New Supplier' }}</h1>
      
      <div class="card">
        <div class="card-body">
          <form [formGroup]="supplierForm" (ngSubmit)="onSubmit()">
            <div class="mb-3">
              <label for="name" class="form-label">Supplier Name</label>
              <input type="text" class="form-control" id="name" formControlName="name" required>
              <div *ngIf="supplierForm.get('name')?.invalid && supplierForm.get('name')?.touched" class="text-danger">
                Supplier name is required
              </div>
            </div>
            
            <div class="mb-3">
              <label for="contactPerson" class="form-label">Contact Person</label>
              <input type="text" class="form-control" id="contactPerson" formControlName="contactPerson" required>
              <div *ngIf="supplierForm.get('contactPerson')?.invalid && supplierForm.get('contactPerson')?.touched" class="text-danger">
                Contact person is required
              </div>
            </div>
            
            <div class="mb-3">
              <label for="address" class="form-label">Address</label>
              <textarea class="form-control" id="address" formControlName="address" rows="3"></textarea>
            </div>
            
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" formControlName="email" required>
                <div *ngIf="supplierForm.get('email')?.invalid && supplierForm.get('email')?.touched" class="text-danger">
                  Valid email is required
                </div>
              </div>
              <div class="col-md-6">
                <label for="phone" class="form-label">Phone Number</label>
                <input type="text" class="form-control" id="phone" formControlName="phone" required>
                <div *ngIf="supplierForm.get('phone')?.invalid && supplierForm.get('phone')?.touched" class="text-danger">
                  Phone number is required
                </div>
              </div>
            </div>
            
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="taxId" class="form-label">Tax ID</label>
                <input type="text" class="form-control" id="taxId" formControlName="taxId">
              </div>
              <div class="col-md-6">
                <label for="category" class="form-label">Category</label>
                <select class="form-control" id="category" formControlName="category">
                  <option value="">Select Category</option>
                  <option value="Materials">Materials</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Services">Services</option>
                  <option value="Labor">Labor</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            
            <div class="d-flex justify-content-between">
              <button type="button" class="btn btn-secondary" routerLink="/suppliers">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="supplierForm.invalid">
                {{ isEditMode ? 'Update' : 'Create' }} Supplier
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class SupplierFormComponent implements OnInit {
  supplierForm: FormGroup;
  isEditMode = false;
  supplierId?: number;
  
  constructor(
    private fb: FormBuilder, 
    private route: ActivatedRoute, 
    private router: Router,
    private supplierService: SupplierService
  ) {
    this.supplierForm = this.fb.group({
      name: ['', Validators.required],
      contactPerson: ['', Validators.required],
      address: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      taxId: [''],
      category: ['']
    });
  }
  
  ngOnInit(): void {
    this.supplierId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.supplierId;
    
    if (this.isEditMode && this.supplierId) {
      this.supplierService.getSupplierById(this.supplierId).subscribe({
        next: (supplier) => {
          this.supplierForm.patchValue({
            name: supplier.name,
            contactPerson: supplier.contactPerson,
            address: supplier.address,
            email: supplier.email,
            phone: supplier.phone,
            taxId: supplier.taxId,
            category: supplier.category
          });
        },
        error: (error) => {
          console.error('Error loading supplier:', error);
        }
      });
    }
  }
  
  onSubmit(): void {
    if (this.supplierForm.valid) {
      const supplierData = this.supplierForm.value;
      
      if (this.isEditMode && this.supplierId) {
        this.supplierService.updateSupplier(this.supplierId, supplierData).subscribe({
          next: (supplier) => {
            console.log('Supplier updated successfully:', supplier);
            this.router.navigate(['/suppliers']);
          },
          error: (error) => {
            console.error('Error updating supplier:', error);
          }
        });
      } else {
        this.supplierService.createSupplier(supplierData).subscribe({
          next: (supplier) => {
            console.log('Supplier created successfully:', supplier);
            this.router.navigate(['/suppliers']);
          },
          error: (error) => {
            console.error('Error creating supplier:', error);
          }
        });
      }
    }
  }
}