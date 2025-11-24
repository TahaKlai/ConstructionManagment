import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <h1 class="mb-4">{{ isEditMode ? 'Edit Project' : 'New Project' }}</h1>
      
      <div class="card">
        <div class="card-body">
          <form [formGroup]="projectForm" (ngSubmit)="onSubmit()">
            <div class="mb-3">
              <label for="name" class="form-label">Project Name</label>
              <input type="text" class="form-control" id="name" formControlName="name" required>
              <div *ngIf="projectForm.get('name')?.invalid && projectForm.get('name')?.touched" class="text-danger">
                Project name is required
              </div>
            </div>
            
            <div class="mb-3">
              <label for="description" class="form-label">Description</label>
              <textarea class="form-control" id="description" formControlName="description" rows="3"></textarea>
            </div>
            
            <div class="mb-3">
              <label for="location" class="form-label">Location</label>
              <input type="text" class="form-control" id="location" formControlName="location">
            </div>
            
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="clientName" class="form-label">Client Name</label>
                <input type="text" class="form-control" id="clientName" formControlName="clientName" required>
                <div *ngIf="projectForm.get('clientName')?.invalid && projectForm.get('clientName')?.touched" class="text-danger">
                  Client name is required
                </div>
              </div>
              <div class="col-md-6">
                <label for="clientContact" class="form-label">Client Contact</label>
                <input type="text" class="form-control" id="clientContact" formControlName="clientContact">
              </div>
            </div>
            
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="startDate" class="form-label">Start Date</label>
                <input type="date" class="form-control" id="startDate" formControlName="startDate" required>
                <div *ngIf="projectForm.get('startDate')?.invalid && projectForm.get('startDate')?.touched" class="text-danger">
                  Start date is required
                </div>
              </div>
              <div class="col-md-6">
                <label for="endDate" class="form-label">End Date</label>
                <input type="date" class="form-control" id="endDate" formControlName="endDate" required>
                <div *ngIf="projectForm.get('endDate')?.invalid && projectForm.get('endDate')?.touched" class="text-danger">
                  End date is required
                </div>
              </div>
            </div>
            
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="totalBudget" class="form-label">Total Budget (€)</label>
                <input type="number" class="form-control" id="totalBudget" formControlName="totalBudget" required>
                <div *ngIf="projectForm.get('totalBudget')?.invalid && projectForm.get('totalBudget')?.touched" class="text-danger">
                  Total budget is required and must be greater than 0
                </div>
              </div>
              <div class="col-md-6">
                <label for="status" class="form-label">Status</label>
                <select class="form-control" id="status" formControlName="status">
                  <option value="Planning">Planning</option>
                  <option value="Active">Active</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            
            <div class="d-flex justify-content-between">
              <button type="button" class="btn btn-secondary" routerLink="/projects">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="projectForm.invalid">
                {{ isEditMode ? 'Update' : 'Create' }} Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ProjectFormComponent implements OnInit {
  projectForm: FormGroup;
  isEditMode = false;
  projectId?: number;
  
  constructor(
    private fb: FormBuilder, 
    private route: ActivatedRoute, 
    private router: Router,
    private projectService: ProjectService
  ) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      location: [''],
      clientName: ['', Validators.required],
      clientContact: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      totalBudget: ['', [Validators.required, Validators.min(0)]],
      status: ['Planning']
    });
  }
  
  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.projectId;
    
    if (this.isEditMode && this.projectId) {
      this.projectService.getProjectById(this.projectId).subscribe({
        next: (project) => {
          // Convert dates to proper format for form
          const formData = {
            ...project,
            startDate: project.startDate ? project.startDate.split('T')[0] : '',
            endDate: project.endDate ? project.endDate.split('T')[0] : ''
          };
          this.projectForm.patchValue(formData);
        },
        error: (error) => {
          console.error('Error loading project:', error);
        }
      });
    }
  }
  
  private formatDateForBackend(dateString: string): string | null {
    if (!dateString) return null;
    // Convert "2025-10-06" to "2025-10-06T00:00:00"
    return dateString + 'T00:00:00';
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      const formValue = this.projectForm.value;
      
      // Transform dates to LocalDateTime format for backend
      const projectData = {
        ...formValue,
        startDate: this.formatDateForBackend(formValue.startDate),
        endDate: this.formatDateForBackend(formValue.endDate)
      };
      
      if (this.isEditMode && this.projectId) {
        this.projectService.updateProject(this.projectId, projectData).subscribe({
          next: (project) => {
            console.log('Project updated successfully:', project);
            this.router.navigate(['/projects']);
          },
          error: (error) => {
            console.error('Error updating project:', error);
          }
        });
      } else {
        this.projectService.createProject(projectData).subscribe({
          next: (project) => {
            console.log('Project created successfully:', project);
            this.router.navigate(['/projects']);
          },
          error: (error) => {
            console.error('Error creating project:', error);
          }
        });
      }
    }
  }
}