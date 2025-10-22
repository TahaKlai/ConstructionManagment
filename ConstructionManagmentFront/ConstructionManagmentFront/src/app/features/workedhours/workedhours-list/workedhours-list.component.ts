import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WorkedHour } from '../../../core/models/project.model';
import { WorkedHourService } from '../../../core/services/worked-hour.service';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-workedhours-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container mt-4">
      <h1 class="mb-4">Worked Hours</h1>
      <div class="row mb-4">
        <div class="col-md-6">
          <div class="input-group">
            <label class="input-group-text" for="projectFilter">Project</label>
            <select class="form-select" id="projectFilter" [(ngModel)]="selectedProjectId">
              <option value="">All Projects</option>
              <option value="1">Office Building Renovation</option>
              <option value="2">Commercial Complex</option>
              <option value="3">Residential Apartments</option>
            </select>
          </div>
        </div>
        <div class="col-md-6">
          <div class="input-group">
            <label class="input-group-text" for="weekFilter">Week</label>
            <select class="form-select" id="weekFilter" [(ngModel)]="selectedWeek">
              <option value="">All Weeks</option>
              <option value="36">Week 36, 2023</option>
              <option value="37">Week 37, 2023</option>
              <option value="38">Week 38, 2023</option>
              <option value="39">Week 39, 2023</option>
            </select>
            <button class="btn btn-primary" (click)="filterWorkHours()">Filter</button>
          </div>
        </div>
      </div>
      
      <div class="d-flex justify-content-between mb-3">
        <button class="btn btn-success" [routerLink]="['/workedhours/project', selectedProjectId || '']">Enter Hours</button>
        <button class="btn btn-outline-secondary" routerLink="/workedhours/import">Import Hours</button>
      </div>
      
      <div class="card">
        <div class="card-body">
          @if (loading) {
            <div class="text-center py-5">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          } @else if (workedHours.length === 0) {
            <div class="text-center py-5">
              <p>No worked hours found</p>
            </div>
          } @else {
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Project</th>
                    <th>Task</th>
                    <th>Week</th>
                    <th>Year</th>
                    <th>Hours</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (entry of workedHours; track entry.id) {
                    <tr>
                      <td>{{ entry.id }}</td>
                      <td>{{ entry.task?.project?.name || 'N/A' }}</td>
                      <td>{{ entry.task?.name || 'N/A' }}</td>
                      <td>{{ entry.weekNumber }}</td>
                      <td>{{ entry.year }}</td>
                      <td>{{ entry.hours }}</td>
                      <td>
                        <button class="btn btn-sm btn-warning me-2" 
                                [routerLink]="['/workedhours', entry.id, 'edit']">
                          Edit
                        </button>
                        <button class="btn btn-sm btn-danger" (click)="deleteEntry(entry.id)">Delete</button>
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
  styles: []
})
export class WorkedHoursListComponent implements OnInit {
  workedHours: WorkedHour[] = [];
  loading = true;
  selectedProjectId: string = '';
  selectedWeek: string = '';
  
  constructor(
    private workedHourService: WorkedHourService,
    private projectService: ProjectService
  ) {}
  
  ngOnInit(): void {
    this.loadWorkHours();
  }
  
  loadWorkHours(): void {
    // Load mock data for now
    setTimeout(() => {
      this.workedHours = [
        {
          id: 1,
          date: '2023-09-04',
          hours: 8,
          workerName: 'John Doe',
          description: 'Site preparation work',
          weekNumber: 36,
          year: 2023,
          taskId: 1,
          task: { id: 1, name: 'Site Preparation' }
        },
        {
          id: 2,
          date: '2023-09-11',
          hours: 8,
          workerName: 'Jane Smith',
          description: 'Structural work',
          weekNumber: 37,
          year: 2023,
          taskId: 3,
          task: { id: 3, name: 'Structural Steel Erection' }
        },
        {
          id: 3,
          date: '2023-09-18',
          hours: 7,
          workerName: 'Mike Johnson',
          description: 'Foundation work',
          weekNumber: 37,
          year: 2023,
          taskId: 4,
          task: { id: 4, name: 'Foundation Complete' }
        },
        {
          id: 4,
          date: '2023-09-25',
          hours: 9,
          workerName: 'Sarah Wilson',
          description: 'Electrical installation',
          weekNumber: 38,
          year: 2023,
          taskId: 5,
          task: { id: 5, name: 'Electrical Work' }
        },
        {
          id: 5,
          date: '2023-10-02',
          hours: 6,
          workerName: 'Tom Brown',
          description: 'Finishing work',
          weekNumber: 38,
          year: 2023,
          taskId: 6,
          task: { id: 6, name: 'Interior Finishing' }
        },
        {
          id: 6,
          date: '2023-10-09',
          hours: 8,
          workerName: 'Lisa Davis',
          description: 'Quality inspection',
          weekNumber: 39,
          year: 2023,
          taskId: 3,
          task: { id: 3, name: 'Structural Steel Erection' }
        }
      ];
      this.loading = false;
    }, 1000);
  }
  
  filterWorkHours(): void {
    this.loading = true;
    
    // In a real app, we would call the service with filters
    console.log('Filtering worked hours:', {
      projectId: this.selectedProjectId,
      weekNumber: this.selectedWeek
    });
    
    // Load worked hours from API
    this.workedHourService.getAllWorkedHours().subscribe({
      next: (workedHours) => {
        this.workedHours = workedHours.filter(entry => {
          const matchesProject = !this.selectedProjectId || (entry.task && entry.task.project && entry.task.project.id === parseInt(this.selectedProjectId, 10));
          const matchesWeek = !this.selectedWeek || entry.weekNumber === parseInt(this.selectedWeek, 10);
          return matchesProject && matchesWeek;
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading worked hours:', error);
        this.loading = false;
      }
    });
  }
  
  deleteEntry(id?: number): void {
    if (id && confirm('Are you sure you want to delete this entry?')) {
      // In a real app, this would call the service to delete the entry
      console.log('Deleting worked hours entry:', id);
      
      // Filter out the deleted entry
      this.workedHours = this.workedHours.filter(entry => entry.id !== id);
    }
  }
}