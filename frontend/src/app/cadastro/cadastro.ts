import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../services/login.services';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [RouterModule, FormsModule, MatInputModule],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css'
})
export class Cadastro {

  senha: any;
  email: any;
  telefone: any;
  cpf: any;
  endereco: any;
  nome: any;

  constructor(private loginService: LoginService, private router: Router) { }

  onSubmit() {
    const usuario = {
      nome: this.nome,
      email: this.email,
      senha: this.senha,
      telefone: this.telefone,
      cpf: this.cpf,
      endereco: this.endereco
    };

    this.loginService.cadastro(usuario).subscribe(
      resposta => {
        console.log('cadastro bem-sucedido!', resposta);
        localStorage.setItem('token', resposta.token);
        this.router.navigate(['home'])
      },
      erro => {
        console.error('Erro ao fazer cadastro', erro);
        if (erro.error?.mensagem) {
          alert(erro.error.mensagem); // Exibe erros como "CPF inválido"
        } else if (erro.error?.errors) {
          for (const campo in erro.error.errors) {
            console.error(`Erro no campo ${campo}:`, erro.error.errors[campo]);
          }
        } else {
          alert("Erro desconhecido ao cadastrar.");
        }
      }
    );
  }
}
