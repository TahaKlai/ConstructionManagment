import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkedHourService } from '../../../core/services/worked-hour.service';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-workedhours-import',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <h1 class="mb-4">Import Worked Hours</h1>
      <div class="card">
        <div class="card-body">
          <form [formGroup]="importForm" (ngSubmit)="onSubmit()">
            <div class="mb-3">
              <label for="project" class="form-label">Project</label>
              <select class="form-select" id="project" formControlName="projectId" required>
                <option value="">Select a project</option>
                <!-- Mock projects would be displayed here -->
                <option value="1">Office Building Renovation</option>
                <option value="2">Commercial Complex</option>
                <option value="3">Residential Apartments</option>
              </select>
              <div *ngIf="importForm.get('projectId')?.invalid && importForm.get('projectId')?.touched" class="text-danger">
                Project is required
              </div>
            </div>
            
            <div class="mb-3">
              <label for="weekNumber" class="form-label">Week Number</label>
              <input type="number" class="form-control" id="weekNumber" formControlName="weekNumber" required min="1" max="53">
              <div *ngIf="importForm.get('weekNumber')?.invalid && importForm.get('weekNumber')?.touched" class="text-danger">
                Valid week number is required (1-53)
              </div>
            </div>
            
            <div class="mb-3">
              <label for="year" class="form-label">Year</label>
              <input type="number" class="form-control" id="year" formControlName="year" required min="2020" max="2030">
              <div *ngIf="importForm.get('year')?.invalid && importForm.get('year')?.touched" class="text-danger">
                Valid year is required (2020-2030)
              </div>
            </div>
            
            <div class="mb-3">
              <label for="csvFile" class="form-label">CSV File</label>
              <input type="file" class="form-control" id="csvFile" accept=".csv" required>
              <small class="form-text text-muted">
                Upload a CSV file with the following columns: TaskID, Hours
              </small>
            </div>
            
            <div class="mb-3">
              <h5>CSV Format Example:</h5>
              <pre class="bg-light p-3">
TaskID,Hours
1,40
2,35
3,20
              </pre>
            </div>
            
            <div class="d-flex justify-content-between">
              <button type="button" class="btn btn-secondary" routerLink="/workedhours">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="importForm.invalid">Import Hours</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class WorkedHoursImportComponent implements OnInit {
  importForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private workedHourService: WorkedHourService,
    private projectService: ProjectService
  ) {
    this.importForm = this.fb.group({
      projectId: ['', Validators.required],
      weekNumber: ['', [Validators.required, Validators.min(1), Validators.max(53)]],
      year: [new Date().getFullYear(), [Validators.required, Validators.min(2020), Validators.max(2030)]]
    });
  }
  
  ngOnInit(): void {
    // Nothing to initialize
  }
  
  onSubmit(): void {
    if (this.importForm.valid) {
      const importData = this.importForm.value;
      
      // In a real app, we would handle file upload and processing
      console.log('Importing worked hours:', importData);
      
      // Simulate success and navigate back
      setTimeout(() => {
        alert('Import completed successfully!');
        this.router.navigate(['/workedhours']);
      }, 1500);
    }
  }
}