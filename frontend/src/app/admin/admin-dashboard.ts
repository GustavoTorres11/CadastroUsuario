import { Component } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha?: string;
  endereco: string;
  cpf: string;
  telefone: string;
  role: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
  imports: [HttpClientModule, FormsModule, CommonModule]
})
export class AdminDashboard {
  id: string | null = null;
  nome = '';
  endereco = '';
  cpf = '';
  telefone = '';
  usuarios: any[] = [];
  usuario: any = {};

  resultadoTrue: any;
  resultadoGet: any;
  resultado: any;

  isExpanded: boolean = false;
  email: any;
  senha: any;

  private apiUrl = 'https://localhost:7135/api/usuario';

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  exibirMensagem(tipo: 'erro' | 'sucesso' | 'get', mensagem: string): void {

    if (tipo === 'erro') {
      this.resultado = mensagem;
      setTimeout(() => this.resultado = '', 3000);
    } else if (tipo === 'sucesso') {
      this.resultadoTrue = mensagem;
      setTimeout(() => this.resultadoTrue = '', 3000);
    } else if (tipo === 'get') {
      this.resultadoGet = mensagem;
      setTimeout(() => this.resultadoGet = '', 3000);
    }
  }

  post(): void {
    const body = {
      nome: this.nome,
      email: this.email,
      senha: this.senha,
      endereco: this.endereco,
      cpf: this.cpf,
      telefone: this.telefone
    };

    if (!body.nome || !body.email || !body.senha || !body.endereco || !body.cpf || !body.telefone) {
      this.exibirMensagem('erro', 'Preencha todos os campos');
    } else {
      this.http.post("https://localhost:7135/api/Cadastro", body)
        .subscribe(() => this.exibirMensagem('sucesso', "Usuário Cadastrado"));
    }
  }

  getUsuariosExpandir(): void {
    this.http.get<Usuario[]>(this.apiUrl, this.getAuthHeaders()).subscribe({
      next: (res) => {
        this.usuarios = res;
        this.usuario = {};
        this.isExpanded = true;
        this.exibirMensagem('get', 'Usuários carregados com sucesso');
      },
      error: (err) => {
        console.error('Erro ao buscar usuários:', err);
        this.exibirMensagem('erro', 'Erro ao buscar usuários');
      }
    });
  }

  put() {
    if (!this.id) {
      this.exibirMensagem('erro', "Informe o Id");
      return;
    }

    const body = {
      id: this.id,
      nome: this.nome,
      email: this.email,
      senha: this.senha,
      endereco: this.endereco,
      cpf: this.cpf,
      telefone: this.telefone
    };

    this.http.put(`${this.apiUrl}/${this.id}`, body, this.getAuthHeaders())
      .subscribe(() => this.exibirMensagem('sucesso', "Usuário Atualizado!"));
  }

  delete() {
    if (!this.id) {
      this.exibirMensagem('erro', "ID não informado");
      return;
    }

    this.http.delete(`${this.apiUrl}/${this.id}`, this.getAuthHeaders())
      .subscribe({
        next: () => this.exibirMensagem('sucesso', "Usuário removido com sucesso"),
        error: (err) => {
          console.error("Erro ao remover usuário:", err);
          this.exibirMensagem('erro', "Erro ao remover usuário");
        }
      });
  }

  fechar(): void {
    this.isExpanded = false;
    this.usuarios = [];
    this.usuario = {};
    this.resultadoGet = '';
    this.resultadoTrue = '';
  }

  verificarId() {
    if (!this.id) {
      this.getUsuariosExpandir();
    } else {
      this.getUsuarioid();
    }
  }

  getUsuarioid(): void {
    this.http.get<Usuario>(`${this.apiUrl}/${this.id}`, this.getAuthHeaders()).subscribe({
      next: (res) => {
        this.usuario = res;
        this.nome = res.nome || '';
        this.email = res.email || '';
        this.endereco = res.endereco || '';
        this.cpf = res.cpf || '';
        this.telefone = res.telefone || '';
        this.usuarios = [];
        this.isExpanded = true;
        this.exibirMensagem('sucesso', 'Usuário carregado com sucesso');
      },
      error: (err) => {
        console.error('Erro ao buscar usuário:', err);
        this.exibirMensagem('erro', 'Erro ao buscar usuário');
      }
    });
  }

  getUsuarionome(): void {
    this.http.get<Usuario>(`${this.apiUrl}/nome/${this.nome}`, this.getAuthHeaders()).subscribe({
      next: (res) => {
        this.usuario = res;
        this.nome = res.nome || '';
        this.email = res.email || '';
        this.endereco = res.endereco || '';
        this.cpf = res.cpf || '';
        this.telefone = res.telefone || '';
        this.usuarios = [];
        this.isExpanded = true;
        this.exibirMensagem('sucesso', 'Usuário carregado com sucesso');
      },
      error: (err) => {
        console.error('Erro ao buscar usuário:', err);
        this.exibirMensagem('erro', 'Erro ao buscar usuário');
      }
    });
  }
}

