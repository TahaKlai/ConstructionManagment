import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Amendment } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class AmendmentService {
  private apiUrl = '/api/amendments';

  constructor(private http: HttpClient) { }

  getAmendmentsByProjectId(projectId: number): Observable<Amendment[]> {
    return this.http.get<Amendment[]>(`${this.apiUrl}/project/${projectId}`);
  }

  getAmendmentById(id: number): Observable<Amendment> {
    return this.http.get<Amendment>(`${this.apiUrl}/${id}`);
  }

  createAmendment(amendment: Amendment): Observable<Amendment> {
    return this.http.post<Amendment>(this.apiUrl, amendment);
  }

  updateAmendment(id: number, amendment: Amendment): Observable<Amendment> {
    return this.http.put<Amendment>(`${this.apiUrl}/${id}`, amendment);
  }

  deleteAmendment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateAmendmentStatus(id: number, status: string): Observable<Amendment> {
    return this.http.patch<Amendment>(`${this.apiUrl}/${id}/status`, { status });
  }
}