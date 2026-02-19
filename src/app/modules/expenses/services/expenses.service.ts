import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PaginatedResponse } from '../../home/models/paginated-response.model';
import { ExpenseCategory } from '../../parameters/models/parameters.models';
import { Expense } from '../models/expense.model';

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  private readonly httpClient = inject(HttpClient);

  getCategories(): Observable<ExpenseCategory[]> {
    return this.httpClient.get<ExpenseCategory[]>(
      `${environment.apiUrl}/domain/expense-categories`,
    );
  }

  getExpenses(
    startDate: string | null,
    endDate: string | null,
    categoryId: string | null,
    page = 1,
    limit = 10,
    sortBy?: 'date' | 'value' | 'categoryId',
    sortDirection: 'asc' | 'desc' = 'desc',
  ): Observable<PaginatedResponse<Expense>> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    if (sortBy) {
      params = params.set('sortBy', sortBy).set('sortDirection', sortDirection);
    }

    if (startDate) {
      params = params.set('startDate', startDate);
    }

    if (endDate) {
      params = params.set('endDate', endDate);
    }

    if (categoryId) {
      params = params.set('categoryId', categoryId);
    }

    return this.httpClient.get<PaginatedResponse<Expense>>(
      `${environment.apiUrl}/expenses/paginated`,
      { params },
    );
  }

  saveExpense(formData: FormData): Observable<void> {
    return this.httpClient.post<void>(`${environment.apiUrl}/expenses`, formData);
  }

  updateExpense(formData: FormData, id: string): Observable<void> {
    return this.httpClient.put<void>(`${environment.apiUrl}/expenses/${id}`, formData);
  }

  getById(id: string): Observable<Expense> {
    return this.httpClient.get<Expense>(`${environment.apiUrl}/expenses/${id}`);
  }

  deleteExpense(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${environment.apiUrl}/expenses/${id}`);
  }
}
