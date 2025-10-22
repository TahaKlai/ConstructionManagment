import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
export interface RiskAssessment {
  id: number;
  projectId: number;
  riskLevel: string;
  delayProbability: number;
  assessmentDate: string;
  riskFactors: Array<{
    name: string;
    severity: string;
    description: string;
  }>;
  confidenceScore: number;
}

@Injectable({
  providedIn: 'root'
})
export class AIService {
  private baseUrl = `${environment.apiUrl}/risk-assessment`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Project Risk Assessment
  assessProjectRisk(projectId: number, projectDescription: string): Observable<RiskAssessment> {
    return this.http.post<RiskAssessment>(
      `${this.baseUrl}/assess/${projectId}`,
      { projectDescription },
      { headers: this.getHeaders() }
    );
  }

  // Get Risk Assessment History
  getRiskHistory(projectId: number): Observable<RiskAssessment[]> {
    return this.http.get<RiskAssessment[]>(
      `${this.baseUrl}/history/${projectId}`,
      { headers: this.getHeaders() }
    );
  }

  // Get Latest Risk Assessment
  getLatestRiskAssessment(projectId: number): Observable<RiskAssessment> {
    return this.http.get<RiskAssessment>(
      `${this.baseUrl}/latest/${projectId}`,
      { headers: this.getHeaders() }
    );
  }
}