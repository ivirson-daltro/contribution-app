import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  Contribution,
  ContributionType,
  Member,
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

  saveContribution(contributionData: Contribution): Observable<void> {
    return this.httpClient.post<void>(`${environment.apiUrl}/contributions`, contributionData);
  }
}
