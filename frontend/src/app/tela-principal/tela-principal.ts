import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioListar } from '../models/usuario';
import { UsuarioService } from '../services/usuario';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tela-principal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tela-principal.html',
  styleUrls: ['./tela-principal.css']
})
export class TelaPrincipal implements OnInit, OnDestroy {

  usuarioLogado: UsuarioListar = {} as UsuarioListar;
  usuarios: UsuarioListar[] = [];
  usuariosGeral: UsuarioListar[] = [];
  searchTerm: string = '';
  mensagem: string = '';
  loading: boolean = false;
  error: string = '';

  // Para gerenciar unsubscribe
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private serviceUsuario: UsuarioService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Verifica se está autenticado antes de carregar dados
    if (!this.authService.isLoggedIn() || this.authService.isTokenExpired()) {
      this.redirecionarParaLogin();
      return;
    }

    this.carregarDados();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private carregarDados(): void {
    this.carregarMensagens();
    this.carregarUsuarios();
    this.carregarUsuarioLogado();
  }

  private carregarUsuarios(): void {
    this.loading = true;
    this.error = '';
    
    this.serviceUsuario.GetUsuarios()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.usuarios = response || [];
          this.usuariosGeral = response || [];
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar usuários:', error);
          this.loading = false;
          
          if (this.isAuthError(error)) {
            this.redirecionarParaLogin();
          } else {
            this.error = 'Erro ao carregar usuários. Verifique sua conexão e tente novamente.';
            this.usuarios = [];
            this.usuariosGeral = [];
          }
        }
      });
  }

  private carregarMensagens(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.mensagem = params['msg'] || '';
        if (this.mensagem) {
          setTimeout(() => {
            this.mensagem = '';
          }, 3000);
        }
      });
  }

  private carregarUsuarioLogado(): void {
    this.serviceUsuario.GetUsuario()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.usuarioLogado = response;
        },
        error: (error) => {
          console.error('Erro ao carregar usuário logado:', error);
          
          if (this.isAuthError(error)) {
            this.redirecionarParaLogin();
          }
          // Se não for erro de auth, continua sem mostrar erro crítico
        }
      });
  }

  private isAuthError(error: any): boolean {
    return error?.status === 401 || 
           error?.message?.includes('Não autorizado') ||
           error?.message?.includes('401');
  }

  private redirecionarParaLogin(): void {
    this.authService.logout();
    this.router.navigate(['/login'], { 
      queryParams: { msg: 'Sessão expirada. Faça login novamente.' },
      replaceUrl: true 
    });
  }

  irParaCadastroCliente(): void {
    this.router.navigate(['/cadastrocliente']);
  }

  editarCliente(id: string): void {
    if (!id) {
      console.error('ID do usuário é obrigatório');
      return;
    }
    this.router.navigate(['/editar', id]);
  }

  deletar(id: string): void {
    if (!id) {
      console.error('ID do usuário é obrigatório');
      return;
    }

    if (!confirm('Tem certeza que deseja deletar este usuário?')) {
      return;
    }

    this.serviceUsuario.DeletarUsuario(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Usuário deletado:', response);
          // Remove o usuário das listas locais
          this.usuarios = this.usuarios.filter(u => u.id !== id);
          this.usuariosGeral = this.usuariosGeral.filter(u => u.id !== id);
          
          this.exibirMensagem('Usuário deletado com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao deletar usuário:', error);
          
          if (this.isAuthError(error)) {
            this.redirecionarParaLogin();
          } else {
            this.exibirMensagem('Erro ao deletar usuário. Tente novamente.');
          }
        }
      });
  }

  buscarUsuarios(): void {
    const termo = this.searchTerm.trim();

    if (!termo) {
      this.usuarios = [...this.usuariosGeral];
      this.error = '';
      return;
    }

    this.loading = true;
    this.serviceUsuario.BuscarUsuarios(termo)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.usuarios = res || [];
          this.loading = false;
          this.error = '';
        },
        error: (err) => {
          console.error('Erro ao buscar usuários:', err);
          this.loading = false;
          
          if (this.isAuthError(err)) {
            this.redirecionarParaLogin();
          } else {
            this.error = 'Erro ao buscar usuários. Tente novamente.';
          }
        }
      });
  }

  limparBusca(): void {
    this.searchTerm = '';
    this.usuarios = [...this.usuariosGeral];
    this.error = '';
  }

  recarregarUsuarios(): void {
    this.carregarUsuarios();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login'], { 
      queryParams: { msg: 'Logout realizado com sucesso!' },
      replaceUrl: true 
    });
  }

  private exibirMensagem(mensagem: string): void {
    this.mensagem = mensagem;
    setTimeout(() => {
      this.mensagem = '';
    }, 3000);
  }
}