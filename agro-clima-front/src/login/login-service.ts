import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../app/environment';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

export interface LoginRequest  { username: string; senha: string; }
export interface LoginResponse { token: string; }
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private readonly TOKEN_KEY = 'jwt_token';
  private apiUrl = `${environment.apiUrl}/auth/login`; // URL do seu backend Spring

  private readonly _http     = inject(HttpClient);
  private readonly _router   = inject(Router);

  readonly isLoggedIn = signal(this.hasValidToken());

  login(data: LoginRequest) {
    return this._http.post<LoginResponse>(this.apiUrl, data).pipe(
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        this.isLoggedIn.set(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isLoggedIn.set(false);
    this._router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
    hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
}
