import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DashboardSummary, PaymentMethodPeriodTotals } from '../models/dashboard-data.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly httpClient = inject(HttpClient);

  getDashboardSummary(): Observable<DashboardSummary> {
    return this.httpClient.get<DashboardSummary>(`${environment.apiUrl}/dashboard/summary`);
  }

  getDashboardPaymentMethods(): Observable<PaymentMethodPeriodTotals[]> {
    return this.httpClient.get<PaymentMethodPeriodTotals[]>(
      `${environment.apiUrl}/dashboard/payment-methods`,
    );
  }
}
