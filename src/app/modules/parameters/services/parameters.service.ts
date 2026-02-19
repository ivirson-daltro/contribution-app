import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ContributionType,
  ExpenseCategory,
  MemberType,
  PaymentMethod,
} from '../models/parameters.models';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ParametersService {
  private readonly httpClient = inject(HttpClient);

  // Member Types
  getMemberTypes(): Observable<MemberType[]> {
    return this.httpClient.get<MemberType[]>(`${environment.apiUrl}/domain/member-types`);
  }

  getMemberTypeById(id: string): Observable<MemberType> {
    return this.httpClient.get<MemberType>(`${environment.apiUrl}/domain/member-types/${id}`);
  }

  createMemberType(memberType: MemberType): Observable<MemberType> {
    return this.httpClient.post<MemberType>(
      `${environment.apiUrl}/domain/member-types`,
      memberType,
    );
  }

  updateMemberType(id: string, memberType: MemberType): Observable<MemberType> {
    return this.httpClient.put<MemberType>(
      `${environment.apiUrl}/domain/member-types/${id}`,
      memberType,
    );
  }

  deleteMemberType(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${environment.apiUrl}/domain/member-types/${id}`);
  }

  // Payment Methods
  getPaymentMethods(): Observable<PaymentMethod[]> {
    return this.httpClient.get<PaymentMethod[]>(`${environment.apiUrl}/domain/payment-methods`);
  }

  getPaymentMethodById(id: string): Observable<PaymentMethod> {
    return this.httpClient.get<PaymentMethod>(`${environment.apiUrl}/domain/payment-methods/${id}`);
  }

  createPaymentMethod(paymentMethod: PaymentMethod): Observable<PaymentMethod> {
    return this.httpClient.post<PaymentMethod>(
      `${environment.apiUrl}/domain/payment-methods`,
      paymentMethod,
    );
  }

  updatePaymentMethod(id: string, paymentMethod: PaymentMethod): Observable<PaymentMethod> {
    return this.httpClient.put<PaymentMethod>(
      `${environment.apiUrl}/domain/payment-methods/${id}`,
      paymentMethod,
    );
  }

  deletePaymentMethod(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${environment.apiUrl}/domain/payment-methods/${id}`);
  }

  // Contribution Types
  getContributionTypes(): Observable<ContributionType[]> {
    return this.httpClient.get<ContributionType[]>(
      `${environment.apiUrl}/domain/contribution-types`,
    );
  }

  getContributionTypeById(id: string): Observable<ContributionType> {
    return this.httpClient.get<ContributionType>(
      `${environment.apiUrl}/domain/contribution-types/${id}`,
    );
  }

  createContributionType(contributionType: ContributionType): Observable<ContributionType> {
    return this.httpClient.post<ContributionType>(
      `${environment.apiUrl}/domain/contribution-types`,
      contributionType,
    );
  }

  updateContributionType(
    id: string,
    contributionType: ContributionType,
  ): Observable<ContributionType> {
    return this.httpClient.put<ContributionType>(
      `${environment.apiUrl}/domain/contribution-types/${id}`,
      contributionType,
    );
  }

  deleteContributionType(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${environment.apiUrl}/domain/contribution-types/${id}`);
  }

  // Expense Categories
  getExpenseCategories(): Observable<ExpenseCategory[]> {
    return this.httpClient.get<ExpenseCategory[]>(
      `${environment.apiUrl}/domain/expense-categories`,
    );
  }

  getExpenseCategoryById(id: string): Observable<ExpenseCategory> {
    return this.httpClient.get<ExpenseCategory>(
      `${environment.apiUrl}/domain/expense-categories/${id}`,
    );
  }

  createExpenseCategory(expenseCategory: ExpenseCategory): Observable<ExpenseCategory> {
    return this.httpClient.post<ExpenseCategory>(
      `${environment.apiUrl}/domain/expense-categories`,
      expenseCategory,
    );
  }

  updateExpenseCategory(id: string, expenseCategory: ExpenseCategory): Observable<ExpenseCategory> {
    return this.httpClient.put<ExpenseCategory>(
      `${environment.apiUrl}/domain/expense-categories/${id}`,
      expenseCategory,
    );
  }

  deleteExpenseCategory(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${environment.apiUrl}/domain/expense-categories/${id}`);
  }
}
