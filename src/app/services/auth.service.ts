import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User {
  id: number;
  email: string;
  mssv?: string;
  fullName: string;
  avatarUrl?: string;
  role: 'ROLE_ADMIN' | 'ROLE_USER' | string;
  status: string;
  provider: string;
  isMasterAdmin?: boolean;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  requiresMssv: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8081/api/auth';
  private readonly ADMIN_URL = 'http://localhost:8081/api/admin';

  currentUser = signal<User | null>(null);
  token = signal<string | null>(null);
  requiresMssv = signal<boolean>(false);

  isLoggedIn = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.currentUser()?.role === 'ROLE_ADMIN');
  isMasterAdmin = computed(() => {
    const user = this.currentUser();
    return !!user && user.isMasterAdmin === true;
  });

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedToken = localStorage.getItem('hocdethi_token');
      const savedUser = localStorage.getItem('hocdethi_user');
      if (savedToken && savedUser) {
        try {
          this.token.set(savedToken);
          this.currentUser.set(JSON.parse(savedUser));
        } catch {
          this.logout();
        }
      }
    }
  }

  getAuthHeaders(): { [header: string]: string } {
    const t = this.token();
    return t ? { Authorization: `Bearer ${t}` } : {};
  }

  getGoogleClientId(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('google_client_id') || '';
    }
    return '';
  }

  setGoogleClientId(clientId: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('google_client_id', clientId.trim());
    }
  }

  redirectToGoogleOAuth(): boolean {
    const clientId = this.getGoogleClientId();
    if (!clientId) {
      return false;
    }
    if (typeof window !== 'undefined') {
      const redirectUri = window.location.origin + '/google-callback';
      const scope = encodeURIComponent('openid email profile');
      const state = 'hocdethi_' + Math.random().toString(36).substring(2);
      const nonce = 'nonce_' + Date.now();
      
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(clientId)}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=token%20id_token&` +
        `scope=${scope}&` +
        `state=${state}&` +
        `nonce=${nonce}&` +
        `prompt=select_account`;

      window.location.href = googleAuthUrl;
    }
    return true;
  }

  loginWithGoogleReal(email: string, fullName: string, avatarUrl?: string, idToken?: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/google`, {
      email,
      fullName,
      avatarUrl,
      idToken
    }).pipe(
      tap(res => this.handleAuthSuccess(res))
    );
  }

  loginWithGoogle(email: string, fullName: string, avatarUrl: string = '', mssv?: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/google`, {
      email,
      fullName,
      avatarUrl,
      mssv
    }).pipe(
      tap(res => this.handleAuthSuccess(res))
    );
  }

  authenticateGoogle(email: string, fullName: string, avatarUrl: string = '', mssv?: string): Observable<AuthResponse> {
    return this.loginWithGoogle(email, fullName, avatarUrl, mssv);
  }

  register(data: { fullName: string; email: string; password: string; mssv?: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, data).pipe(
      tap(res => this.handleAuthSuccess(res))
    );
  }

  login(identifier: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, { identifier, password }).pipe(
      tap(res => this.handleAuthSuccess(res))
    );
  }

  loginAdmin(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/admin-login`, {
      email,
      password
    }).pipe(
      tap(res => this.handleAuthSuccess(res))
    );
  }

  createSubAdmin(data: { fullName: string; email: string; password: string }): Observable<User> {
    return this.http.post<User>(`${this.ADMIN_URL}/create-sub-admin`, data, {
      headers: this.getAuthHeaders()
    });
  }

  updateMssv(mssv: string): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/update-mssv`, { mssv }, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(user => {
        this.currentUser.set(user);
        this.requiresMssv.set(false);
        if (typeof window !== 'undefined') {
          localStorage.setItem('hocdethi_user', JSON.stringify(user));
        }
      })
    );
  }

  private handleAuthSuccess(res: AuthResponse) {
    this.token.set(res.token);
    this.currentUser.set(res.user);
    this.requiresMssv.set(res.requiresMssv);

    if (typeof window !== 'undefined') {
      localStorage.setItem('hocdethi_token', res.token);
      localStorage.setItem('hocdethi_user', JSON.stringify(res.user));
    }
  }

  logout() {
    this.token.set(null);
    this.currentUser.set(null);
    this.requiresMssv.set(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hocdethi_token');
      localStorage.removeItem('hocdethi_user');
    }
  }
}
