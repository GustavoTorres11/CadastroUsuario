import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { UsuarioListar, UsuarioResult } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  ApiUrl = environment.UrlApi;
  ApiCad = environment.UrlCad;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // Método para criar headers com token (compatível com SSR)
  private getHttpOptions() {
    let token: string | null = null;
    
    // Só acessa localStorage se estiver no browser
    if (this.isBrowser()) {
      token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    }

    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      })
    };
  }

  GetUsuarios(): Observable<UsuarioListar[]> {
    return this.http.get<UsuarioListar[]>(this.ApiUrl, this.getHttpOptions())
      .pipe(
        catchError(this.handleError)
      );
  }

  DeletarUsuario(id: string): Observable<any> {
    return this.http.delete(`${this.ApiUrl}/${id}`, this.getHttpOptions())
      .pipe(
        catchError(this.handleError)
      );
  }

  CriarUsuario(usuario: UsuarioListar): Observable<UsuarioResult> {
    return this.http.post<UsuarioResult>(this.ApiCad, usuario, this.getHttpOptions())
      .pipe(
        catchError(this.handleError)
      );
  }

  GetUsuarioId(id: string): Observable<UsuarioListar> {
    return this.http.get<UsuarioListar>(`${this.ApiUrl}/${id}`, this.getHttpOptions())
      .pipe(
        catchError(this.handleError)
      );
  }

  EditarUsuario(usuario: UsuarioListar): Observable<UsuarioResult> {
    return this.http.put<UsuarioResult>(`${this.ApiUrl}/${usuario.id}`, usuario, this.getHttpOptions())
      .pipe(
        catchError(this.handleError)
      );
  }

  BuscarUsuarios(termo: string): Observable<UsuarioListar[]> {
    const termoCodificado = encodeURIComponent(termo);
    return this.http.get<UsuarioListar[]>(`${this.ApiUrl}/buscar?termo=${termoCodificado}`, this.getHttpOptions())
      .pipe(
        catchError(this.handleError)
      );
  }

  GetUsuario(): Observable<UsuarioListar> {
    return this.http.get<UsuarioListar>(`${this.ApiUrl}/usuario`, this.getHttpOptions())
      .pipe(
        catchError(this.handleError)
      );
  }

  // Método para tratamento de erros
  private handleError = (error: any): Observable<never> => {
    console.error('Erro no serviço:', error);

    let errorMessage = 'Erro desconhecido';

    if (error.status === 401) {
      errorMessage = 'Não autorizado. Faça login novamente.';
      // Remove token inválido se estiver no browser
      if (this.isBrowser()) {
        localStorage.removeItem('token');
        localStorage.removeItem('auth_token');
      }
    } else if (error.status === 403) {
      errorMessage = 'Acesso negado.';
    } else if (error.status === 404) {
      errorMessage = 'Recurso não encontrado.';
    } else if (error.status === 500) {
      errorMessage = 'Erro interno do servidor.';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    }

    return throwError(() => new Error(errorMessage));
  }
}