import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { WorkedHourService } from '../../../core/services/worked-hour.service';
import { ProjectService } from '../../../core/services/project.service';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-workedhours-entry',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <h1 class="mb-4">Enter Worked Hours</h1>
      <div class="card mb-4">
        <div class="card-header">
          Project: {{ projectName }} - Week {{ selectedWeek }}
        </div>
        <div class="card-body">
          @if (loading) {
            <div class="text-center py-5">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          } @else {
            <form [formGroup]="hoursForm" (ngSubmit)="onSubmit()">
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="weekSelect" class="form-label">Select Week:</label>
                  <select class="form-select" id="weekSelect" [(ngModel)]="selectedWeek" [ngModelOptions]="{standalone: true}" (change)="loadWeekData()">
                    <option value="36">Week 36, 2023</option>
                    <option value="37">Week 37, 2023</option>
                    <option value="38">Week 38, 2023</option>
                    <option value="39">Week 39, 2023</option>
                    <option value="40">Week 40, 2023</option>
                  </select>
                </div>
              </div>
              
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Mon</th>
                    <th>Tue</th>
                    <th>Wed</th>
                    <th>Thu</th>
                    <th>Fri</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody formArrayName="entries">
                  @for (entry of entriesFormArray.controls; track $index) {
                    <tr [formGroupName]="$index">
                      <td>
                        <select class="form-select" formControlName="taskId">
                          <option value="">-- Select Task --</option>
                          @for (task of projectTasks; track task.id) {
                            <option [value]="task.id">{{ task.name }}</option>
                          }
                        </select>
                      </td>
                      <td><input type="number" class="form-control" formControlName="monday" min="0" max="24"></td>
                      <td><input type="number" class="form-control" formControlName="tuesday" min="0" max="24"></td>
                      <td><input type="number" class="form-control" formControlName="wednesday" min="0" max="24"></td>
                      <td><input type="number" class="form-control" formControlName="thursday" min="0" max="24"></td>
                      <td><input type="number" class="form-control" formControlName="friday" min="0" max="24"></td>
                      <td>{{ calculateRowTotal($index) }}</td>
                    </tr>
                  }
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="6">
                      <button type="button" class="btn btn-outline-primary" (click)="addEntry()">Add Row</button>
                    </td>
                    <td><strong>{{ calculateTotalHours() }}</strong></td>
                  </tr>
                </tfoot>
              </table>
              
              <div class="d-flex justify-content-between">
                <button type="button" class="btn btn-secondary" routerLink="/workedhours">Cancel</button>
                <button type="submit" class="btn btn-primary" [disabled]="hoursForm.invalid">Save Hours</button>
              </div>
            </form>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-control::-webkit-inner-spin-button,
    .form-control::-webkit-outer-spin-button {
      opacity: 1;
    }
  `]
})
export class WorkedHoursEntryComponent implements OnInit {
  hoursForm: FormGroup;
  loading = true;
  projectId?: number;
  selectedWeek?: number;
  projectName = 'Office Building Renovation'; // Default mock project name
  projectTasks = [
    { id: 1, name: 'Site Preparation' },
    { id: 2, name: 'Foundation Complete' },
    { id: 3, name: 'Structural Steel Erection' }
  ];
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private workedHourService: WorkedHourService,
    private projectService: ProjectService,
    private taskService: TaskService
  ) {
    this.hoursForm = this.fb.group({
      entries: this.fb.array([])
    });
  }
  
  get entriesFormArray(): FormArray {
    return this.hoursForm.get('entries') as FormArray;
  }
  
  ngOnInit(): void {
    const projectIdParam = this.route.snapshot.paramMap.get('projectId');
    const weekParam = this.route.snapshot.paramMap.get('weekNumber');
    
    this.projectId = projectIdParam ? parseInt(projectIdParam, 10) : undefined;
    this.selectedWeek = weekParam ? parseInt(weekParam, 10) : 39; // Default to current week
    
    // If no project is selected, redirect to the worked hours list
    if (!this.projectId) {
      this.router.navigate(['/workedhours']);
      return;
    }
    
    // Add an initial empty row
    this.addEntry();
    
    // Load project tasks and any existing hours
    this.loadProjectData();
  }
  
  loadProjectData(): void {
    // In a real app, we would load project details and tasks from the API
    // For now, we'll use mock data
    setTimeout(() => {
      // If this is an edit operation, load existing hours
      if (this.selectedWeek) {
        this.loadWeekData();
      } else {
        this.loading = false;
      }
    }, 1000);
  }
  
  loadWeekData(): void {
    this.loading = true;
    
    // In a real app, we would load the hours data for the selected week
    console.log(`Loading hours for project ${this.projectId}, week ${this.selectedWeek}`);
    
    // Mock data for demonstration
    setTimeout(() => {
      // Clear existing entries
      while (this.entriesFormArray.length !== 0) {
        this.entriesFormArray.removeAt(0);
      }
      
      // Add mock entries
      if (this.projectId === 1 && this.selectedWeek === 39) {
        this.entriesFormArray.push(this.createEntry(1, 8, 8, 8, 8, 8));
        this.entriesFormArray.push(this.createEntry(3, 0, 4, 4, 4, 0));
      } else if (this.projectId === 1 && this.selectedWeek === 38) {
        this.entriesFormArray.push(this.createEntry(1, 4, 4, 4, 4, 4));
        this.entriesFormArray.push(this.createEntry(3, 4, 4, 4, 4, 4));
      } else {
        // Add an empty entry for new weeks
        this.addEntry();
      }
      
      this.loading = false;
    }, 500);
  }
  
  addEntry(): void {
    this.entriesFormArray.push(this.createEntry());
  }
  
  createEntry(
    taskId: number | null = null, 
    monday = 0, 
    tuesday = 0, 
    wednesday = 0, 
    thursday = 0, 
    friday = 0
  ): FormGroup {
    return this.fb.group({
      taskId: [taskId],
      monday: [monday, [Validators.min(0), Validators.max(24)]],
      tuesday: [tuesday, [Validators.min(0), Validators.max(24)]],
      wednesday: [wednesday, [Validators.min(0), Validators.max(24)]],
      thursday: [thursday, [Validators.min(0), Validators.max(24)]],
      friday: [friday, [Validators.min(0), Validators.max(24)]]
    });
  }
  
  calculateRowTotal(index: number): number {
    const entry = this.entriesFormArray.at(index) as FormGroup;
    const monday = entry.get('monday')?.value || 0;
    const tuesday = entry.get('tuesday')?.value || 0;
    const wednesday = entry.get('wednesday')?.value || 0;
    const thursday = entry.get('thursday')?.value || 0;
    const friday = entry.get('friday')?.value || 0;
    
    return monday + tuesday + wednesday + thursday + friday;
  }
  
  calculateTotalHours(): number {
    let total = 0;
    for (let i = 0; i < this.entriesFormArray.length; i++) {
      total += this.calculateRowTotal(i);
    }
    return total;
  }
  
  onSubmit(): void {
    if (this.hoursForm.valid) {
      const entries = this.entriesFormArray.value.filter((entry: any) => 
        entry.taskId && (entry.monday > 0 || entry.tuesday > 0 || entry.wednesday > 0 || entry.thursday > 0 || entry.friday > 0)
      );
      
      // Transform each day into separate WorkedHour records
      const workedHours: any[] = [];
      const currentYear = 2023;
      const weekNumber = this.selectedWeek || 39;
      
      entries.forEach((entry: any) => {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        days.forEach((day, index) => {
          if (entry[day] > 0) {
            // Calculate date based on week and day
            const startOfYear = new Date(currentYear, 0, 1);
            const daysToAdd = (weekNumber - 1) * 7 + index;
            const workDate = new Date(startOfYear.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
            
            workedHours.push({
              taskId: entry.taskId,
              date: workDate.toISOString().split('T')[0] + 'T00:00:00',
              hours: entry[day],
              workerName: 'Current User', // This should be from authenticated user
              description: `Hours worked on ${day}`,
              weekNumber: weekNumber,
              year: currentYear
            });
          }
        });
      });
      
      // Save each worked hour record
      let savedCount = 0;
      workedHours.forEach(workedHour => {
        this.workedHourService.createWorkedHour(workedHour).subscribe({
          next: (result) => {
            console.log('Worked hour saved:', result);
            savedCount++;
            if (savedCount === workedHours.length) {
              this.router.navigate(['/workedhours']);
            }
          },
          error: (error) => {
            console.error('Error saving worked hour:', error);
          }
        });
      });
      
      // If no hours to save, just navigate back
      if (workedHours.length === 0) {
        this.router.navigate(['/workedhours']);
      }
    }
  }
}