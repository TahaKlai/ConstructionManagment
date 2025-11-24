import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-project-import',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <h1 class="mb-4">Import Project Data</h1>
      
      <div class="card">
        <div class="card-body">
          <div *ngIf="project" class="mb-4">
            <h3>Project: {{ project.name }}</h3>
            <p class="text-muted">{{ project.description }}</p>
          </div>
          
          <form [formGroup]="importForm" (ngSubmit)="onSubmit()">
            <div class="mb-3">
              <label for="dataType" class="form-label">Data Type</label>
              <select class="form-select" id="dataType" formControlName="dataType" required>
                <option value="">Select data type to import</option>
                <option value="tasks">Tasks</option>
                <option value="budget">Budget Lines</option>
                <option value="hours">Worked Hours</option>
                <option value="invoices">Invoices</option>
              </select>
              <div *ngIf="importForm.get('dataType')?.invalid && importForm.get('dataType')?.touched" class="text-danger">
                Data type is required
              </div>
            </div>
            
            <div class="mb-3">
              <label for="file" class="form-label">Import File</label>
              <input type="file" class="form-control" id="file" accept=".csv,.xlsx,.xls" required>
              <small class="form-text text-muted">
                Upload a CSV or Excel file with the data to import
              </small>
            </div>
            
            <div class="mb-3 form-check">
              <input type="checkbox" class="form-check-input" id="overwrite" formControlName="overwrite">
              <label class="form-check-label" for="overwrite">Overwrite existing data</label>
            </div>
            
            <div class="mb-3">
              <h5>Example Templates:</h5>
              <div class="list-group">
                <a href="#" class="list-group-item list-group-item-action" (click)="downloadTemplate('tasks')">
                  <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">Tasks Template</h6>
                    <small><i class="bi bi-download"></i></small>
                  </div>
                  <small>Fields: Name, Description, Milestone, Start Date, Duration, Status</small>
                </a>
                <a href="#" class="list-group-item list-group-item-action" (click)="downloadTemplate('budget')">
                  <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">Budget Lines Template</h6>
                    <small><i class="bi bi-download"></i></small>
                  </div>
                  <small>Fields: Code, Description, Amount, Due Date, Remarks</small>
                </a>
              </div>
            </div>
            
            <div class="d-flex justify-content-between">
              <button type="button" class="btn btn-secondary" [routerLink]="['/projects', projectId]">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="importForm.invalid">Import Data</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ProjectImportComponent implements OnInit {
  projectId?: number;
  project?: any;
  importForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService
  ) {
    this.importForm = this.fb.group({
      dataType: ['', Validators.required],
      overwrite: [false]
    });
  }
  
  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    
    if (!this.projectId) {
      this.router.navigate(['/projects']);
      return;
    }
    
    // Load project details
    // Mock data for now
    this.project = {
      id: this.projectId,
      name: 'Office Building Renovation',
      description: 'Complete renovation of a 6-story office building including structural upgrades and modern amenities',
      clientName: 'ABC Corporation',
      clientContact: '+31 20 555 7890',
      location: 'Amsterdam',
      startDate: '2023-06-10',
      endDate: '2024-11-30',
      status: 'Active',
      totalBudget: 850000
    };
  }
  
  downloadTemplate(type: string): void {
    // In a real application, this would generate and download a template file
    console.log(`Downloading ${type} template`);
  }
  
  onSubmit(): void {
    if (this.importForm.valid) {
      const importData = {
        ...this.importForm.value,
        projectId: this.projectId
      };
      
      console.log('Import data:', importData);
      
      // Simulate successful import
      setTimeout(() => {
        alert('Data imported successfully!');
        this.router.navigate(['/projects', this.projectId]);
      }, 1500);
    }
  }
}