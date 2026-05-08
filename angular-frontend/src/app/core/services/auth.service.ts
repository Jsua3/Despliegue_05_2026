import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, UserResponse } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenKey = 'parcial_token';
  private readonly userKey = 'parcial_user';

  readonly currentUser = signal<UserResponse | null>(this.readStoredUser());

  token(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return Boolean(this.token());
  }

  isStaffOrAdmin(): boolean {
    const role = this.currentUser()?.role;
    return role === 'STAFF' || role === 'ADMIN';
  }

  login(payload: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, payload).pipe(
      tap((response) => this.persistSession(response))
    );
  }

  register(payload: { nombre: string; email: string; password: string }) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, payload).pipe(
      tap((response) => this.persistSession(response))
    );
  }

  refreshMe() {
    if (!this.token()) {
      return of(null);
    }

    return this.http.get<UserResponse>(`${environment.apiUrl}/auth/me`).pipe(
      tap((user) => this.persistUser(user)),
      catchError(() => {
        this.logout(false);
        return of(null);
      })
    );
  }

  logout(navigate = true): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
    this.currentUser.set(null);
    if (navigate) {
      this.router.navigate(['/login']);
    }
  }

  private persistSession(response: AuthResponse): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.tokenKey, response.token);
    }
    this.persistUser(response.user);
  }

  private persistUser(user: UserResponse): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
    this.currentUser.set(user);
  }

  private readStoredUser(): UserResponse | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    const raw = localStorage.getItem(this.userKey);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as UserResponse;
    } catch {
      localStorage.removeItem(this.userKey);
      return null;
    }
  }
}
