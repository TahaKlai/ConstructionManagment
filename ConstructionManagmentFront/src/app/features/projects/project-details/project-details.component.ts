import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Project } from '../../../core/models/project.model';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-4">
      @if (loading) {
        <div class="text-center py-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      } @else if (!project) {
        <div class="alert alert-warning">
          Project not found
        </div>
      } @else {
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1>{{ project.name }}</h1>
          <div>
            <button class="btn btn-warning me-2" [routerLink]="['/projects', project.id, 'edit']">Edit</button>
            <button class="btn btn-danger" (click)="deleteProject()">Delete</button>
          </div>
        </div>
        
        <!-- Project Info -->
        <div class="card mb-4">
          <div class="card-header d-flex justify-content-between">
            <span>Project Details</span>
            <span class="badge" [ngClass]="getStatusClass(project.status)">
              {{ project.status }}
            </span>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <p><strong>Client:</strong> {{ project.clientName }}</p>
                <p><strong>Contact:</strong> {{ project.clientContact }}</p>
                <p><strong>Location:</strong> {{ project.location }}</p>
              </div>
              <div class="col-md-6">
                <p><strong>Start Date:</strong> {{ project.startDate }}</p>
                <p><strong>End Date:</strong> {{ project.endDate }}</p>
                <p><strong>Total Budget:</strong> {{ project.totalBudget | currency:'EUR' }}</p>
              </div>
            </div>
            <div class="mt-3">
              <h5>Description</h5>
              <p>{{ project.description }}</p>
            </div>
          </div>
        </div>
        
        <!-- Tabs -->
        <ul class="nav nav-tabs mb-4">
          <li class="nav-item">
            <a class="nav-link active" href="#">Tasks</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Budget</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Invoices</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Worked Hours</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Documents</a>
          </li>
        </ul>
        
        <!-- Tasks Tab Content (Default) -->
        <div class="card mb-4">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Tasks</h5>
            <button class="btn btn-sm btn-primary">Add Task</button>
          </div>
          <div class="card-body">
            @if (project.tasks && project.tasks.length > 0) {
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Milestone</th>
                      <th>Start Date</th>
                      <th>Duration</th>
                      <th>Completion %</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (task of project.tasks; track task.id) {
                      <tr>
                        <td>{{ task.name }}</td>
                        <td>
                          <span class="badge" [ngClass]="task.milestone ? 'bg-primary' : 'bg-secondary'">
                            {{ task.milestone ? 'Yes' : 'No' }}
                          </span>
                        </td>
                        <td>{{ task.plannedStartDate }}</td>
                        <td>{{ task.duration }} days</td>
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
                        <td>{{ task.status }}</td>
                        <td>
                          <button class="btn btn-sm btn-info me-1">Edit</button>
                          <button class="btn btn-sm btn-danger">Delete</button>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            } @else {
              <div class="text-center py-4">
                <p>No tasks found for this project</p>
                <button class="btn btn-primary">Add First Task</button>
              </div>
            }
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="d-flex justify-content-between mb-4">
          <button class="btn btn-secondary" routerLink="/projects">Back to Projects</button>
          <div>
            <button class="btn btn-success me-2" [routerLink]="['/projects', project.id, 'import']">Import Data</button>
            <button class="btn btn-info">Export Report</button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .progress {
      height: 20px;
    }
  `]
})
export class ProjectDetailsComponent implements OnInit {
  projectId?: number;
  project?: Project;
  loading = true;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService
  ) {}
  
  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    
    if (!this.projectId) {
      this.router.navigate(['/projects']);
      return;
    }
    
    // Load project details from API
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (project) => {
        this.project = project;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading project:', error);
        this.loading = false;
      }
    });
  }
  
  getStatusClass(status?: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-success';
      case 'completed':
        return 'bg-primary';
      case 'on hold':
        return 'bg-warning';
      case 'cancelled':
        return 'bg-danger';
      case 'planning':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  }
  
  deleteProject(): void {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      // In a real app, we would call the service to delete the project
      console.log('Deleting project:', this.projectId);
      this.router.navigate(['/projects']);
    }
  }
}