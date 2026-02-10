import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UserCredentials } from '../models/user-credentials.model';
import { User } from '../../users/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);

  login(credentials: UserCredentials): Observable<void> {
    return this.httpClient
      .post<{ token: string; user: User }>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          const token = response?.token;
          if (token) {
            localStorage.setItem(environment.APP_AUTH_TOKEN_KEY, token);
            localStorage.setItem(environment.APP_USER_KEY, JSON.stringify(response.user));
          }
        }),
        map(() => void 0),
      );
  }

  forgotPassword(email: string): Observable<void> {
    return this.httpClient.post<void>(`${environment.apiUrl}/auth/password/forgot`, { email });
  }

  resetPassword(token: string, password: string): Observable<void> {
    return this.httpClient.post<void>(`${environment.apiUrl}/auth/password/reset`, {
      token,
      password,
    });
  }

  register(user: User): Observable<void> {
    return this.httpClient.post<void>(`${environment.apiUrl}/auth/register`, user);
  }

  getToken(): string | null {
    return localStorage.getItem(environment.APP_AUTH_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(environment.APP_AUTH_TOKEN_KEY);
    localStorage.removeItem(environment.APP_USER_KEY);
  }
}
