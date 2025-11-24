import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkedHour } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class WorkedHourService {
  private apiUrl = '/api/worked-hours';

  constructor(private http: HttpClient) { }

  getAllWorkedHours(): Observable<WorkedHour[]> {
    return this.http.get<WorkedHour[]>(this.apiUrl);
  }

  getWorkedHoursByProjectId(projectId: number): Observable<WorkedHour[]> {
    return this.http.get<WorkedHour[]>(`${this.apiUrl}/project/${projectId}`);
  }

  getWorkedHourById(id: number): Observable<WorkedHour> {
    return this.http.get<WorkedHour>(`${this.apiUrl}/${id}`);
  }

  createWorkedHour(workedHour: WorkedHour): Observable<WorkedHour> {
    return this.http.post<WorkedHour>(this.apiUrl, workedHour);
  }

  updateWorkedHour(id: number, workedHour: WorkedHour): Observable<WorkedHour> {
    return this.http.put<WorkedHour>(`${this.apiUrl}/${id}`, workedHour);
  }

  deleteWorkedHour(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  approveWorkedHour(id: number): Observable<WorkedHour> {
    return this.http.patch<WorkedHour>(`${this.apiUrl}/${id}/approve`, {});
  }

  rejectWorkedHour(id: number): Observable<WorkedHour> {
    return this.http.patch<WorkedHour>(`${this.apiUrl}/${id}/reject`, {});
  }
}