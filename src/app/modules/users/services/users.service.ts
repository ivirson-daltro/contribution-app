import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PaginatedResponse } from '../../home/models/paginated-response.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly httpClient = inject(HttpClient);

  getPaginatedUsers(
    page = 1,
    limit = 10,
    sortBy?: 'name' | 'email' | 'role',
    sortDirection: 'asc' | 'desc' = 'asc',
  ): Observable<PaginatedResponse<User>> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    if (sortBy) {
      params = params.set('sortBy', sortBy).set('sortDirection', sortDirection);
    }
    return this.httpClient.get<PaginatedResponse<User>>(`${environment.apiUrl}/users/paginated`, {
      params,
    });
  }

  saveUser(userData: User): Observable<void> {
    return this.httpClient.post<void>(`${environment.apiUrl}/users`, userData);
  }

  getById(userId: string): Observable<User> {
    return this.httpClient.get<User>(`${environment.apiUrl}/users/${userId}`);
  }

  updateUser(userId: string, userData: User): Observable<void> {
    return this.httpClient.put<void>(`${environment.apiUrl}/users/${userId}`, userData);
  }

  deleteUser(userId: string): Observable<void> {
    return this.httpClient.delete<void>(`${environment.apiUrl}/users/${userId}`);
  }
}
