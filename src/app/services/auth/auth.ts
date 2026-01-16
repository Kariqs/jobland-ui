import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CreateAccountResponse,
  JwtPayload,
  LoginInfo,
  LoginResponse,
  User,
} from '../../types/auth.types';
import { ErrorHandlerService } from '../../utils/error.handler.util';
import { Router } from '@angular/router';

export interface UserInfo {
  email: string;
  fullname: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = `${environment.apiUrl}/api/auth`;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService,
    private router: Router
  ) {}

  createAccount(userInfo: User): Observable<CreateAccountResponse> {
    return this.http
      .post<CreateAccountResponse>(`${this.apiUrl}/signup`, userInfo)
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }

  login(loginInfo: LoginInfo): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, loginInfo)
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }

  isAuthenticated() {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    try {
      const decoded: JwtPayload = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();
      if (isExpired) {
        localStorage.removeItem('token');
        return false;
      }
      return true;
    } catch (error) {
      localStorage.removeItem('token');
      return false;
    }
  }

  getUserInfo(): UserInfo | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const decoded: JwtPayload = jwtDecode(token);
      const userinfo: UserInfo = {
        fullname: decoded.fullname,
        email: decoded.email,
      };
      return userinfo;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['']);
  }
}
