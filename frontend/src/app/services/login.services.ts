import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    private apiUrl = 'http://localhost:5280/api';

    constructor(private http: HttpClient) { }

    login(email: string, senha: string): Observable<any> {
        const body = { Email: email, Senha: senha };
        return this.http.post(`${this.apiUrl}/login`, body);
    }
    cadastro(usuario: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/Cadastro`, usuario);
    }
}