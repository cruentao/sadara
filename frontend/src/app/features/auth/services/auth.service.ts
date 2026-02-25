import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User } from '../../../core/models/user.model';
import { LoginRequest, LoginResponse } from '../models/login.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Access token kept in memory only — never in localStorage
  private accessToken: string | null = null;

  // Reactive signal for the current authenticated user
  currentUser = signal<User | null>(null);

  private readonly baseUrl = `${environment.apiUrl}/auth`;

  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    const body: LoginRequest = { email, password };
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, body).pipe(
      tap((response) => {
        this.accessToken = response.accessToken;
        this.currentUser.set({
          id: response.user.id,
          email: response.user.email,
          role: response.user.role as User['role'],
          institucion_id: response.user.institucion_id,
        });
      }),
    );
  }

  logout(): void {
    this.accessToken = null;
    this.currentUser.set(null);
    // Backend call to invalidate refresh token cookie will be added when implemented
  }

  refreshToken(): Observable<LoginResponse> {
    // Refresh token is sent automatically via httpOnly cookie
    return this.http.post<LoginResponse>(`${this.baseUrl}/refresh`, {}).pipe(
      tap((response) => {
        this.accessToken = response.accessToken;
        this.currentUser.set({
          id: response.user.id,
          email: response.user.email,
          role: response.user.role as User['role'],
          institucion_id: response.user.institucion_id,
        });
      }),
    );
  }

  isAuthenticated(): boolean {
    return this.accessToken !== null;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }
}
