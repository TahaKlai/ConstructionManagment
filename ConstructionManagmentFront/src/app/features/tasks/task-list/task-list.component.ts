import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Task } from '../../../core/models/project.model';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-4">
      <h1 class="mb-4">Tasks</h1>
      <div class="d-flex justify-content-between mb-3">
        <button class="btn btn-primary" routerLink="/tasks/new">Add New Task</button>
        <div class="input-group w-50">
          <input type="text" class="form-control" placeholder="Search tasks...">
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
          } @else if (tasks.length === 0) {
            <div class="text-center py-5">
              <p>No tasks found</p>
            </div>
          } @else {
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Project</th>
                    <th>Name</th>
                    <th>Milestone</th>
                    <th>Start Date</th>
                    <th>Duration (days)</th>
                    <th>Completion %</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (task of tasks; track task.id) {
                    <tr>
                      <td>{{ task.id }}</td>
                      <td>{{ task.projectId }}</td>
                      <td>{{ task.name }}</td>
                      <td>
                        <span class="badge" [ngClass]="task.milestone ? 'bg-primary' : 'bg-secondary'">
                          {{ task.milestone ? 'Milestone' : 'Regular' }}
                        </span>
                      </td>
                      <td>{{ task.plannedStartDate }}</td>
                      <td>{{ task.duration }}</td>
                      <td>
                        <div class="progress">
                          <div class="progress-bar" role="progressbar" 
                               [style.width.%]="task.completionPercentage" 
                               [attr.aria-valuenow]="task.completionPercentage" 
                               aria-valuemin="0" aria-valuemax="100">
                            {{ task.completionPercentage }}%
                          </div>
                        </div>
                      </td>
                      <td>
                        <span class="badge" [ngClass]="getStatusClass(task.status)">
                          {{ task.status }}
                        </span>
                      </td>
                      <td>
                        <a [routerLink]="['/tasks', task.id]" class="btn btn-sm btn-info me-2">View</a>
                        <a [routerLink]="['/tasks', task.id, 'edit']" class="btn btn-sm btn-warning">Edit</a>
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
    
    .progress {
      height: 20px;
    }
  `]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  loading = true;
  
  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    console.log('Loading tasks from service...');
    
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.loading = false;
        console.log('Tasks loaded from service:', tasks.length);
        console.log('First task:', tasks[0]?.name);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.tasks = [];
        this.loading = false;
      }
    });
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