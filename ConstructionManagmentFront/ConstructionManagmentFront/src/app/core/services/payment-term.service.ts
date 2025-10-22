import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentTerm } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentTermService {
  private apiUrl = '/api/paymentterms';

  constructor(private http: HttpClient) { }

  getPaymentTermsByProjectId(projectId: number): Observable<PaymentTerm[]> {
    return this.http.get<PaymentTerm[]>(`${this.apiUrl}/project/${projectId}`);
  }

  getPaymentTermById(id: number): Observable<PaymentTerm> {
    return this.http.get<PaymentTerm>(`${this.apiUrl}/${id}`);
  }

  createPaymentTerm(paymentTerm: PaymentTerm): Observable<PaymentTerm> {
    return this.http.post<PaymentTerm>(this.apiUrl, paymentTerm);
  }

  updatePaymentTerm(id: number, paymentTerm: PaymentTerm): Observable<PaymentTerm> {
    return this.http.put<PaymentTerm>(`${this.apiUrl}/${id}`, paymentTerm);
  }

  deletePaymentTerm(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updatePaymentTermStatus(id: number, status: string): Observable<PaymentTerm> {
    return this.http.patch<PaymentTerm>(`${this.apiUrl}/${id}/status`, { status });
  }
}