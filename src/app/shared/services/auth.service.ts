import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { IUser, User } from "../dto/user.dto";
import { environment } from "../../../environments/environment";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  refresh_token?: string;
  message?: string;
  _id?: string;
  id?: string;
  user?: IUser;
}

export interface RefreshTokenRequest {
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface VerifyEmailRequest {
  token: string;
}

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private BASE_URL = `${environment.BASE_URL}`;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /**
   * Get authentication headers with Bearer token
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('currentUser');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  /**
   * Get HTTP options with authentication
   */
  private getHttpOptions() {
    return {
      headers: this.getAuthHeaders(),
    };
  }

  /**
   * Register a new user
   * POST /api/v1/auth/register
   */
  register(registerData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.BASE_URL}/auth/register`,
      registerData
    );
  }

  /**
   * Login user and receive JWT token
   * POST /api/v1/auth/login
   */
  login(loginData: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.BASE_URL}/auth/login`,
      loginData
    );
  }

  /**
   * Get authenticated user's profile
   * GET /api/v1/auth/profile
   */
  getProfile(): Observable<IUser> {
    return this.http.get<IUser>(
      `${this.BASE_URL}/auth/profile`,
      this.getHttpOptions()
    );
  }

  /**
   * Refresh JWT token
   * POST /api/v1/auth/refresh-token
   */
  refreshToken(token: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.BASE_URL}/auth/refresh-token`,
      { token }
    );
  }

  /**
   * Logout user (client should remove token from storage)
   * POST /api/v1/auth/logout
   */
  logout(): Observable<void> {
    return this.http.post<void>(
      `${this.BASE_URL}/auth/logout`,
      {},
      this.getHttpOptions()
    );
  }

  /**
   * Request password reset link
   * POST /api/v1/auth/forgot-password
   */
  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(
      `${this.BASE_URL}/auth/forgot-password`,
      { email }
    );
  }

  /**
   * Reset password using token from email
   * POST /api/v1/auth/reset-password
   */
  resetPassword(resetData: ResetPasswordRequest): Observable<any> {
    return this.http.post<any>(
      `${this.BASE_URL}/auth/reset-password`,
      resetData
    );
  }

  /**
   * Verify email address using token
   * POST /api/v1/auth/verify-email
   */
  verifyEmail(token: string): Observable<any> {
    return this.http.post<any>(
      `${this.BASE_URL}/auth/verify-email`,
      { token }
    );
  }

  /**
   * Resend email verification link
   * POST /api/v1/auth/resend-verification
   */
  resendVerification(email: string): Observable<any> {
    return this.http.post<any>(
      `${this.BASE_URL}/auth/resend-verification`,
      { email }
    );
  }

  /**
   * Save token to localStorage
   */
  saveToken(token: string): void {
    localStorage.setItem('currentUser', token);
  }

  /**
   * Get token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('currentUser');
  }

  /**
   * Remove token from localStorage
   */
  removeToken(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
