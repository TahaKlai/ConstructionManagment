import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = '/api/invoices';

  constructor(private http: HttpClient) { }

  getAllInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.apiUrl);
  }

  getInvoicesByProjectId(projectId: number): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/project/${projectId}`);
  }

  getInvoiceById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/${id}`);
  }

  createInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(this.apiUrl, invoice);
  }

  updateInvoice(id: number, invoice: Invoice): Observable<Invoice> {
    return this.http.put<Invoice>(`${this.apiUrl}/${id}`, invoice);
  }

  deleteInvoice(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updatePaymentStatus(id: number, paid: boolean): Observable<Invoice> {
    return this.http.patch<Invoice>(`${this.apiUrl}/${id}/payment-status`, { paid });
  }

  getInvoiceFile(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/file`, {
      responseType: 'blob'
    });
  }
}
