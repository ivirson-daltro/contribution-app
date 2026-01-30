import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User } from '../../auth/models/user.model';
import { PaginatedResponse } from '../../home/models/domain.model';

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
    return this.httpClient.get<PaginatedResponse<User>>(
      `${environment.apiUrl}/auth/users/paginated`,
      {
        params,
      },
    );
  }

  saveUser(userData: User): Observable<void> {
    return this.httpClient.post<void>(`${environment.apiUrl}/auth/users`, userData);
  }

  getById(userId: string): Observable<User> {
    return this.httpClient.get<User>(`${environment.apiUrl}/auth/users/${userId}`);
  }

  updateUser(userId: string, userData: User): Observable<void> {
    return this.httpClient.put<void>(`${environment.apiUrl}/auth/users/${userId}`, userData);
  }

  deleteUser(userId: string): Observable<void> {
    return this.httpClient.delete<void>(`${environment.apiUrl}/auth/users/${userId}`);
  }
}
