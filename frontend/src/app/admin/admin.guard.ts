import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  canActivate(): boolean {
    // Só acessa localStorage no navegador
    if (isPlatformBrowser(this.platformId)) {
      const role = localStorage.getItem('role');

      if (role === 'admin') {
        return true;
      }
    }

    // Se não for admin ou estiver no SSR
    this.router.navigate(['home']);
    return false;
  }
}
