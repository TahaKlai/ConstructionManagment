import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { AIService } from '../../../core/services/ai.service';

interface RiskFactor {
  id: number;
  name: string;
  severity: string;
  description: string;
}

@Component({
  selector: 'app-risk-assessment',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  template: `
    <div class="risk-assessment-card card h-100">
      <div class="card-header bg-white">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="card-title mb-0">
            <i class="bi bi-shield-exclamation text-warning me-2"></i>
            Project Risk Assessment
          </h5>
          <div class="dropdown">
            <button class="btn btn-link btn-sm" type="button" data-bs-toggle="dropdown">
              <i class="bi bi-three-dots-vertical"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item" href="#" (click)="refreshRiskData($event)">Refresh Analysis</a></li>
              <li><a class="dropdown-item" href="#" (click)="viewDetails($event)">View Details</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="card-body">
        @if (loading) {
          <div class="d-flex justify-content-center align-items-center p-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        } @else if (error) {
          <div class="alert alert-danger">
            {{ error }}
          </div>
        } @else {
          <div class="risk-stats mb-4">
            <div class="row g-3">
              <div class="col-md-4">
                <div class="risk-stat-item p-3 border rounded">
                  <h6 class="text-muted mb-1">Overall Risk Level</h6>
                  <div class="d-flex align-items-center">
                    <div class="risk-indicator" [ngClass]="getRiskLevelClass()"></div>
                    <h4 class="mb-0 ms-2">{{ riskLevel }}</h4>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="risk-stat-item p-3 border rounded">
                  <h6 class="text-muted mb-1">Delay Probability</h6>
                  <h4 class="mb-0">{{ delayProbability }}%</h4>
                </div>
              </div>
              <div class="col-md-4">
                <div class="risk-stat-item p-3 border rounded">
                  <h6 class="text-muted mb-1">Risk Factors</h6>
                  <h4 class="mb-0">{{ riskFactors.length }}</h4>
                </div>
              </div>
            </div>
          </div>
          
          <div class="risk-factors-list">
            <h6 class="mb-3">Top Risk Factors</h6>
            <div class="list-group">
              @for (factor of riskFactors; track factor.id) {
                <div class="list-group-item list-group-item-action">
                  <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">{{ factor.name }}</h6>
                    <small [ngClass]="getSeverityClass(factor.severity)">
                      {{ factor.severity }}
                    </small>
                  </div>
                  <p class="mb-1">{{ factor.description }}</p>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .risk-assessment-card {
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    }
    .risk-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    .risk-indicator.high {
      background-color: #dc3545;
    }
    .risk-indicator.medium {
      background-color: #ffc107;
    }
    .risk-indicator.low {
      background-color: #28a745;
    }
    .risk-stat-item {
      background-color: #fff;
      transition: transform 0.2s;
    }
    .risk-stat-item:hover {
      transform: translateY(-2px);
    }
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class RiskAssessmentComponent implements OnInit {
  riskLevel: string = 'Medium';
  delayProbability: number = 35;
  loading: boolean = false;
  error: string | null = null;
  riskFactors: RiskFactor[] = [];

  constructor(private aiService: AIService) {}

  ngOnInit(): void {
    this.loadLatestRiskAssessment();
  }

  private loadLatestRiskAssessment(): void {
    this.loading = true;
    this.error = null;
    const projectId = this.getCurrentProjectId();

    if (projectId) {
      this.aiService.getLatestRiskAssessment(projectId).subscribe({
        next: (assessment) => {
          this.riskLevel = assessment.riskLevel;
          this.delayProbability = assessment.delayProbability;
          this.riskFactors = assessment.riskFactors.map((factor, index) => ({
            id: index + 1,
            name: factor.name,
            severity: factor.severity,
            description: factor.description
          }));
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading risk assessment:', err);
          this.error = 'Failed to load risk assessment. Please try again later.';
          this.loading = false;
        }
      });
    } else {
      this.error = 'No active project selected.';
      this.loading = false;
    }
  }

  refreshRiskData(event: Event): void {
    event.preventDefault();
    this.loadLatestRiskAssessment();
  }

  viewDetails(event: Event): void {
    event.preventDefault();
    // TODO: Implement detailed view navigation
    console.log('View details clicked');
  }

  getRiskLevelClass(): string {
    return this.riskLevel.toLowerCase();
  }

  getSeverityClass(severity: string): string {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'text-danger';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return '';
    }
  }

  private getCurrentProjectId(): number | null {
    // TODO: Implement getting current project ID from state management
    return 1; // Temporary return for demonstration
  }
}