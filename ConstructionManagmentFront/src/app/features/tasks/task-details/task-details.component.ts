import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Task } from '../../../core/models/project.model';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Task Details</h1>
        <div>
          <button class="btn btn-warning me-2" [routerLink]="['/tasks', taskId, 'edit']">Edit</button>
          <button class="btn btn-danger" (click)="deleteTask()">Delete</button>
        </div>
      </div>
      
      @if (loading) {
        <div class="text-center py-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      } @else if (!task) {
        <div class="alert alert-warning">
          Task not found
        </div>
      } @else {
        <div class="card">
          <div class="card-header d-flex justify-content-between">
            <span>{{ task.name }}</span>
            <span class="badge" [ngClass]="getStatusClass(task.status)">
              {{ task.status }}
            </span>
          </div>
          <div class="card-body">
            <div class="row mb-4">
              <div class="col-md-6">
                <h5 class="text-muted">Task Information</h5>
                <p><strong>Project ID:</strong> {{ task.projectId }}</p>
                <p><strong>Milestone:</strong> {{ task.milestone ? 'Yes' : 'No' }}</p>
                <p><strong>Start Date:</strong> {{ task.plannedStartDate }}</p>
                <p><strong>Duration:</strong> {{ task.duration }} days</p>
                <p><strong>Description:</strong> {{ task.description }}</p>
              </div>
              <div class="col-md-6">
                <h5 class="text-muted">Progress</h5>
                <p><strong>Completion:</strong></p>
                <div class="progress mb-3">
                  <div class="progress-bar" role="progressbar" 
                       [style.width.%]="task.completionPercentage" 
                       [attr.aria-valuenow]="task.completionPercentage" 
                       aria-valuemin="0" aria-valuemax="100">
                    {{ task.completionPercentage }}%
                  </div>
                </div>
              </div>
            </div>
            
            <div class="d-grid gap-2 d-md-flex justify-content-md-start">
              <button class="btn btn-secondary" routerLink="/tasks">Back to List</button>
              @if (task.status !== 'Completed') {
                <button class="btn btn-success" (click)="markAsCompleted()">Mark as Completed</button>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .progress {
      height: 25px;
    }
  `]
})
export class TaskDetailsComponent implements OnInit {
  taskId?: number;
  task?: Task;
  loading = true;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) {}
  
  ngOnInit(): void {
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    
    // Mock data for now
    setTimeout(() => {
      this.task = {
        id: this.taskId,
        projectId: 1,
        name: 'Site Preparation',
        description: 'Clear site and prepare foundation',
        milestone: false,
        plannedStartDate: '2023-06-15',
        duration: 14,
        completionPercentage: 75,
        status: 'In Progress'
      };
      this.loading = false;
    }, 1000);
  }
  
  markAsCompleted(): void {
    if (this.task) {
      this.task.status = 'Completed';
      this.task.completionPercentage = 100;
      // In a real app, this would call the service to update the task status
      console.log('Task marked as completed:', this.task);
    }
  }
  
  deleteTask(): void {
    if (confirm('Are you sure you want to delete this task?')) {
      // In a real app, this would call the service to delete the task
      console.log('Deleting task:', this.taskId);
      this.router.navigate(['/tasks']);
    }
  }
  
  getStatusClass(status?: string): string {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-success';
      case 'in progress':
        return 'bg-info';
      case 'not started':
        return 'bg-secondary';
      case 'delayed':
        return 'bg-warning';
      case 'on hold':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }
}