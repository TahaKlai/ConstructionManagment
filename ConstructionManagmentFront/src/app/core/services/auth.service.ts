import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, Role, User } from '../models/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'auth_token';
  private jwtHelper = new JwtHelperService();
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  
  private authState = signal<boolean>(this.hasValidToken());

  constructor(private http: HttpClient) {
    this.loadUserFromToken();
  }

  login(loginRequest: LoginRequest): Observable<AuthResponse> {
    console.log('AuthService: Making login request to real backend /api/auth/login for user', loginRequest.username);
    return this.http.post<AuthResponse>('/api/auth/login', loginRequest)
      .pipe(
        tap(response => {
          console.log('AuthService: Login response received', response);
          const token = response.token;
          this.storeToken(token);
          this.loadUserFromToken();
        })
      );
  }

  register(registerRequest: RegisterRequest): Observable<any> {
    return this.http.post<any>('/api/auth/register', registerRequest, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  logout(): void {
    console.log('=== LOGOUT: Clearing all authentication data ===');
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
    this.authState.set(false);
    console.log('✅ All authentication data cleared');
  }

  // Debug method to force clear auth state
  forceLogout(): void {
    console.log('=== FORCE LOGOUT: Clearing ALL stored data ===');
    localStorage.clear(); // Clear everything
    this.currentUserSubject.next(null);
    this.authState.set(false);
    console.log('✅ ALL localStorage data cleared');
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    
    if (token) {
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          const now = Math.floor(Date.now() / 1000);
          
          if (payload.exp && payload.exp < now) {
            console.log('❌ TOKEN EXPIRED! Clearing...');
            this.logout();
            return null;
          }
          console.log('✅ Token is valid for user:', payload.sub);
        }
      } catch (e) {
        console.log('❌ Invalid token format, clearing...');
        this.logout();
        return null;
      }
    }
    
    return token;
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.authState.set(true);
  }

  private loadUserFromToken(): void {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken = this.jwtHelper.decodeToken(token);
        if (decodedToken) {
          const rolesRaw = decodedToken.roles;
          const roles: Role[] = Array.isArray(rolesRaw)
            ? rolesRaw.map((role: any, index: number) => typeof role === 'string'
                ? ({ id: index, name: role })
                : role)
            : typeof rolesRaw === 'string'
              ? rolesRaw.split(',').map((role: string, index: number) => ({ id: index, name: role.trim() }))
              : [];

          const user: User = {
            username: decodedToken.sub,
            email: decodedToken.email || '',
            fullName: decodedToken.fullName || decodedToken.sub || 'Unknown User',
            roles
          };
          this.currentUserSubject.next(user);
          this.authState.set(true);
        }
      } catch (error) {
        this.logout();
      }
    }
  }

  hasValidToken(): boolean {
    const token = this.getToken();
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  isAuthenticated(): boolean {
    return this.authState();
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    if (!user || !user.roles) {
      return false;
    }
    return user.roles.some(r => (typeof r === 'string' ? r === role : r.name === role));
  }
}