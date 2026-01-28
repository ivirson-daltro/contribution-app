import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  Contribution,
  ContributionType,
  Member,
  PaginatedResponse,
  PaymentMethod,
} from '../../home/models/domain.model';

@Injectable({
  providedIn: 'root',
})
export class ContributionsService {
  private readonly httpClient = inject(HttpClient);

  getMembers(): Observable<Member[]> {
    return this.httpClient.get<Member[]>(`${environment.apiUrl}/members`);
  }

  getContributionTypes(): Observable<ContributionType[]> {
    return this.httpClient.get<ContributionType[]>(
      `${environment.apiUrl}/domain/contribution-types`,
    );
  }

  getPaymentMethods(): Observable<PaymentMethod[]> {
    return this.httpClient.get<PaymentMethod[]>(`${environment.apiUrl}/domain/payment-methods`);
  }

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

  saveContribution(contributionData: Contribution): Observable<void> {
    return this.httpClient.post<void>(`${environment.apiUrl}/contributions`, contributionData);
  }

  getWeeklyReport(startDate: string, endDate: string): Observable<Blob> {
    const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);

    return this.httpClient.get(`${environment.apiUrl}/contributions/weekly/report`, {
      params,
      responseType: 'blob',
    });
  }
}
