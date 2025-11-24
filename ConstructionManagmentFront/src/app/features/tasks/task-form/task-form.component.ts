import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../../core/services/task.service';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <h1 class="mb-4">{{ isEditMode ? 'Edit Task' : 'New Task' }}</h1>
      
      <div class="card">
        <div class="card-body">
          <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
            <div class="mb-3">
              <label for="projectId" class="form-label">Project</label>
              <select class="form-control" id="projectId" formControlName="projectId" required>
                <option value="">Select a project</option>
                <!-- Mock projects would be displayed here -->
                <option value="1">Office Building Renovation</option>
                <option value="2">Commercial Complex</option>
                <option value="3">Residential Apartments</option>
              </select>
              <div *ngIf="taskForm.get('projectId')?.invalid && taskForm.get('projectId')?.touched" class="text-danger">
                Project is required
              </div>
            </div>
            
            <div class="mb-3">
              <label for="name" class="form-label">Task Name</label>
              <input type="text" class="form-control" id="name" formControlName="name" required>
              <div *ngIf="taskForm.get('name')?.invalid && taskForm.get('name')?.touched" class="text-danger">
                Task name is required
              </div>
            </div>
            
            <div class="mb-3">
              <label for="description" class="form-label">Description</label>
              <textarea class="form-control" id="description" formControlName="description" rows="3"></textarea>
            </div>
            
            <div class="mb-3">
              <label for="wbsCode" class="form-label">WBS Code</label>
              <input type="text" class="form-control" id="wbsCode" formControlName="wbsCode">
            </div>
            
            <div class="mb-3 form-check">
              <input type="checkbox" class="form-check-input" id="milestone" formControlName="milestone">
              <label class="form-check-label" for="milestone">Mark as Milestone</label>
            </div>
            
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="plannedStartDate" class="form-label">Planned Start Date</label>
                  <input type="date" class="form-control" id="plannedStartDate" formControlName="plannedStartDate" required>
                  <div *ngIf="taskForm.get('plannedStartDate')?.invalid && taskForm.get('plannedStartDate')?.touched" class="text-danger">
                    Planned start date is required
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="plannedEndDate" class="form-label">Planned End Date</label>
                  <input type="date" class="form-control" id="plannedEndDate" formControlName="plannedEndDate">
                </div>
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="actualStartDate" class="form-label">Actual Start Date</label>
                  <input type="date" class="form-control" id="actualStartDate" formControlName="actualStartDate">
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="actualEndDate" class="form-label">Actual End Date</label>
                  <input type="date" class="form-control" id="actualEndDate" formControlName="actualEndDate">
                </div>
              </div>
            </div>
            
            <div class="mb-3">
              <label for="duration" class="form-label">Duration (days)</label>
              <input type="number" class="form-control" id="duration" formControlName="duration" required>
              <div *ngIf="taskForm.get('duration')?.invalid && taskForm.get('duration')?.touched" class="text-danger">
                Duration is required and must be greater than 0
              </div>
            </div>
            
            <div class="mb-3">
              <label for="completionPercentage" class="form-label">Completion Percentage</label>
              <input type="range" class="form-range" id="completionPercentage" formControlName="completionPercentage" min="0" max="100" step="5">
              <div class="text-center">{{ taskForm.get('completionPercentage')?.value }}%</div>
            </div>
            
            <div class="mb-3">
              <label for="status" class="form-label">Status</label>
              <select class="form-control" id="status" formControlName="status">
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Delayed">Delayed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
            
            <div class="mb-3">
              <label for="parentId" class="form-label">Parent Task (Optional)</label>
              <select class="form-control" id="parentId" formControlName="parentId">
                <option value="">No Parent Task</option>
                <!-- Parent tasks will be populated dynamically -->
              </select>
            </div>
            
            <div class="d-flex justify-content-between">
              <button type="button" class="btn btn-secondary" routerLink="/tasks">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="taskForm.invalid">
                {{ isEditMode ? 'Update' : 'Create' }} Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  isEditMode = false;
  taskId?: number;
  
  constructor(
    private fb: FormBuilder, 
    private route: ActivatedRoute, 
    private router: Router,
    private taskService: TaskService,
    private projectService: ProjectService
  ) {
    this.taskForm = this.fb.group({
      projectId: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      wbsCode: [''],
      milestone: [false],
      plannedStartDate: ['', Validators.required],
      plannedEndDate: [''],
      actualStartDate: [''],
      actualEndDate: [''],
      duration: ['', [Validators.required, Validators.min(1)]],
      completionPercentage: [0],
      status: ['Not Started'],
      parentId: ['']
    });
  }
  
  ngOnInit(): void {
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.taskId;
    
    if (this.isEditMode && this.taskId) {
      this.taskService.getTaskById(this.taskId).subscribe({
        next: (task) => {
          this.taskForm.patchValue({
            projectId: task.project?.id || task.projectId,
            name: task.name,
            description: task.description,
            wbsCode: task.wbsCode,
            milestone: task.milestone,
            plannedStartDate: task.plannedStartDate ? task.plannedStartDate.split('T')[0] : '',
            plannedEndDate: task.plannedEndDate ? task.plannedEndDate.split('T')[0] : '',
            actualStartDate: task.actualStartDate ? task.actualStartDate.split('T')[0] : '',
            actualEndDate: task.actualEndDate ? task.actualEndDate.split('T')[0] : '',
            duration: task.duration,
            completionPercentage: task.completionPercentage,
            status: task.status,
            parentId: task.parent?.id || task.parentId
          });
        },
        error: (error) => {
          console.error('Error loading task:', error);
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
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      
      // Transform dates to LocalDateTime format for backend
      const taskData = {
        ...formValue,
        plannedStartDate: this.formatDateForBackend(formValue.plannedStartDate),
        plannedEndDate: this.formatDateForBackend(formValue.plannedEndDate),
        actualStartDate: this.formatDateForBackend(formValue.actualStartDate),
        actualEndDate: this.formatDateForBackend(formValue.actualEndDate)
      };
      
      if (this.isEditMode && this.taskId) {
        this.taskService.updateTask(this.taskId, taskData).subscribe({
          next: (task) => {
            console.log('Task updated successfully:', task);
            this.router.navigate(['/tasks']);
          },
          error: (error) => {
            console.error('Error updating task:', error);
          }
        });
      } else {
        this.taskService.createTask(taskData).subscribe({
          next: (task) => {
            console.log('Task created successfully:', task);
            this.router.navigate(['/tasks']);
          },
          error: (error) => {
            console.error('Error creating task:', error);
          }
        });
      }
    }
  }
}