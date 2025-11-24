import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BudgetLine } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private apiUrl = '/api/budgetlines';

  constructor(private http: HttpClient) { }

  getAllBudgetLines(): Observable<BudgetLine[]> {
    return this.http.get<BudgetLine[]>(this.apiUrl);
  }

  getBudgetLinesByProjectId(projectId: number): Observable<BudgetLine[]> {
    return this.http.get<BudgetLine[]>(`${this.apiUrl}/project/${projectId}`);
  }

  getBudgetLineById(id: number): Observable<BudgetLine> {
    return this.http.get<BudgetLine>(`${this.apiUrl}/${id}`);
  }

  createBudgetLine(budgetLine: BudgetLine): Observable<BudgetLine> {
    return this.http.post<BudgetLine>(this.apiUrl, budgetLine);
  }

  updateBudgetLine(id: number, budgetLine: BudgetLine): Observable<BudgetLine> {
    return this.http.put<BudgetLine>(`${this.apiUrl}/${id}`, budgetLine);
  }

  deleteBudgetLine(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Import budget lines from Excel
  importBudgetLines(projectId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.apiUrl}/project/${projectId}/import`, formData);
  }

  // Export budget lines to Excel
  exportBudgetLines(projectId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/project/${projectId}/export`, {
      responseType: 'blob'
    });
  }
}