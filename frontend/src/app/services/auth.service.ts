import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Injectable({ 
  providedIn: 'root' 
})
export class AuthService {
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  getToken(): string | null {
    if (!this.isBrowser()) {
      return null; // No servidor, não há localStorage
    }
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem('token', token);
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
    }
  }

  // Método para verificar se o token está expirado
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  // Método para verificar se é admin (descomente e ajuste conforme necessário)
  // isAdmin(): boolean {
  //     const token = this.getToken();
  //     if (!token) return false;

  //     try {
  //       const decoded: any = jwtDecode(token);
  //       return decoded?.role === 'admin'; // Ajuste conforme sua estrutura
  //     } catch (error) {
  //       return false;
  //     }
  // }
}