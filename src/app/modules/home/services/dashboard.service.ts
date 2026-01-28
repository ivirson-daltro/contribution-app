import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DashboardSummary, PaymentMethodPeriodTotals } from '../models/dashboard-data.model';
import { Contribution, PaginatedResponse } from '../models/domain.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly httpClient = inject(HttpClient);

  getContributions(
    memberId: string | null,
    contributionTypeId: string | null,
    paymentMethodId: string | null,
    page = 1,
    limit = 10,
    sortBy?:
      | 'date'
      | 'amount'
      | 'createdAt'
      | 'memberId'
      | 'paymentMethodId'
      | 'contributionTypeId',
    sortDirection: 'asc' | 'desc' = 'desc',
  ): Observable<PaginatedResponse<Contribution>> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    if (sortBy) {
      params = params.set('sortBy', sortBy).set('sortDirection', sortDirection);
    }

    if (memberId) {
      params = params.set('memberId', memberId);
    }

    if (contributionTypeId) {
      params = params.set('contributionTypeId', contributionTypeId);
    }

    if (paymentMethodId) {
      params = params.set('paymentMethodId', paymentMethodId);
    }

    return this.httpClient.get<PaginatedResponse<Contribution>>(
      `${environment.apiUrl}/contributions`,
      { params },
    );
  }

  getDashboardSummary(): Observable<DashboardSummary> {
    return this.httpClient.get<DashboardSummary>(`${environment.apiUrl}/contributions/dashboard`);
  }

  getDashboardPaymentMethods(): Observable<PaymentMethodPeriodTotals[]> {
    return this.httpClient.get<PaymentMethodPeriodTotals[]>(
      `${environment.apiUrl}/contributions/dashboard/payment-methods`,
    );
  }

  getWeeklyReport(startDate: string, endDate: string): Observable<Blob> {
    const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);

    return this.httpClient.get(`${environment.apiUrl}/contributions/weekly/report`, {
      params,
      responseType: 'blob',
    });
  }
}
