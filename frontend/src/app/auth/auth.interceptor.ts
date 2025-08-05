import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Obtém o token do serviço de autenticação
  const token = authService.getToken();

  // Se não há token, prossegue sem modificar a requisição
  if (!token) {
    return next(req);
  }

  // Clona a requisição e adiciona o header de autorização
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};