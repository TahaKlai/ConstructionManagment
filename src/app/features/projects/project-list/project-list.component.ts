import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models/project.model';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ConfirmationDialogComponent],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  loading = true;
  searchTerm = '';
  statusFilter = '';
  
  // For confirmation dialog
  showConfirmDialog = false;
  projectToDelete: Project | null = null;
  
  private projectService = inject(ProjectService);
  private toastr = inject(ToastrService);
  
  ngOnInit(): void {
    this.loadProjects();
  }
  
  loadProjects(): void {
    this.loading = true;
    this.projectService.getAllProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error('Error loading projects');
        console.error('Error loading projects', error);
        this.loading = false;
      }
    });
  }
  
  applyFilters(): void {
    this.filteredProjects = this.projects.filter(project => {
      return (
        (this.searchTerm === '' || 
         project.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
         project.description.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
        (this.statusFilter === '' || project.status === this.statusFilter)
      );
    });
  }
  
  confirmDelete(project: Project): void {
    this.projectToDelete = project;
    this.showConfirmDialog = true;
  }
  
  deleteProject(): void {
    if (!this.projectToDelete) return;
    
    this.projectService.deleteProject(this.projectToDelete.id!).subscribe({
      next: () => {
        this.toastr.success('Project deleted successfully');
        this.projects = this.projects.filter(p => p.id !== this.projectToDelete!.id);
        this.applyFilters();
        this.closeConfirmDialog();
      },
      error: (error) => {
        this.toastr.error('Error deleting project');
        console.error('Error deleting project', error);
        this.closeConfirmDialog();
      }
    });
  }
  
  closeConfirmDialog(): void {
    this.showConfirmDialog = false;
    this.projectToDelete = null;
  }
  
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'completed':
        return 'primary';
      case 'on hold':
        return 'warning';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  }
}