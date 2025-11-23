import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_KEY = 'codes-labs-admin-2024'; // API key simple
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkAuth());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private router: Router) {}

  /**
   * Verifica si hay una sesión activa
   */
  private checkAuth(): boolean {
    const authToken = localStorage.getItem('admin_auth_token');
    return authToken === this.API_KEY;
  }

  /**
   * Inicia sesión con API key
   */
  login(apiKey: string): boolean {
    if (apiKey === this.API_KEY) {
      localStorage.setItem('admin_auth_token', apiKey);
      this.isAuthenticatedSubject.next(true);
      return true;
    }
    return false;
  }

  /**
   * Cierra sesión
   */
  logout(): void {
    localStorage.removeItem('admin_auth_token');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/']);
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Obtiene el token de autenticación
   */
  getToken(): string | null {
    return localStorage.getItem('admin_auth_token');
  }
}

