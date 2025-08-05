import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Home } from '../home/home';
import { AdminDashboard } from '../admin/admin-dashboard';
import { LoginService } from '../services/login.services';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule], // Adicionado CommonModule
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit { // Adicionado OnInit
  email: string = '';
  senha: string = '';
  
  // NOVAS PROPRIEDADES ADICIONADAS
  mensagem: string = '';
  erro: boolean = false;
  loading: boolean = false;

  constructor(
    private loginService: LoginService, 
    private router: Router,
    // NOVOS PARÂMETROS ADICIONADOS
    private route: ActivatedRoute,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  // NOVO MÉTODO ADICIONADO
  ngOnInit(): void {
    // Verifica se já está logado (apenas no browser)
    if (this.isBrowser() && this.authService.isLoggedIn() && !this.authService.isTokenExpired()) {
      this.redirecionarPorRole();
      return;
    }

    // Captura mensagens da query string
    this.route.queryParams.subscribe(params => {
      if (params['msg']) {
        this.mensagem = params['msg'];
        this.erro = params['error'] === 'true';
        
        setTimeout(() => {
          this.mensagem = '';
        }, 5000);
      }
    });
  }

  // NOVO MÉTODO ADICIONADO
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  onSubmit() {
    // VALIDAÇÃO ADICIONADA NO INÍCIO
    if (!this.email || !this.senha) {
      this.exibirMensagem('Por favor, preencha todos os campos.', true);
      return;
    }

    this.loading = true; // ADICIONADO
    this.mensagem = ''; // ADICIONADO

    this.loginService.login(this.email, this.senha).subscribe(
      (resposta: { token: string; role: string; }) => {
        console.log('Login bem-sucedido!', resposta);
        this.loading = false; // ADICIONADO

        localStorage.setItem('token', resposta.token);
        
        // ADICIONADO - Salva também no AuthService
        this.authService.setToken(resposta.token);
        if (this.isBrowser()) {
          localStorage.setItem('role', resposta.role);
        }

        if (resposta.role === 'admin') {
          this.router.navigate(['admin'])
        } else {
          this.router.navigate(['home'])
        }
      },
      (erro: any) => {
        console.error('Erro ao fazer login', erro);
        this.loading = false; // ADICIONADO
        
        // TRATAMENTO DE ERRO MELHORADO
        let mensagemErro = 'Erro ao fazer login. Tente novamente.';
        
        if (erro.status === 401) {
          mensagemErro = 'Email ou senha incorretos.';
        } else if (erro.status === 400) {
          mensagemErro = 'Dados inválidos. Verifique os campos.';
        } else if (erro.status === 500) {
          mensagemErro = 'Erro interno do servidor.';
        } else if (erro.error?.message) {
          mensagemErro = erro.error.message;
        } else if (typeof erro.error === 'string') {
          mensagemErro = erro.error;
        }
        
        this.exibirMensagem(mensagemErro, true); // ADICIONADO
      }
    );
  }

  // NOVOS MÉTODOS ADICIONADOS
  private redirecionarPorRole(role?: string): void {
    if (!role && this.isBrowser()) {
      role = localStorage.getItem('role') || '';
    }

    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    
    if (returnUrl) {
      this.router.navigate([returnUrl]);
    } else if (role === 'admin') {
      this.router.navigate(['admin']);
    } else {
      this.router.navigate(['home']);
    }
  }

  private exibirMensagem(mensagem: string, erro: boolean = false): void {
    this.mensagem = mensagem;
    this.erro = erro;
    
    setTimeout(() => {
      this.mensagem = '';
    }, 5000);
  }
}