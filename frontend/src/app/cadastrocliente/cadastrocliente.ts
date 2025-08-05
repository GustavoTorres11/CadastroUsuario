import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { UsuarioService } from '../services/usuario';
import { Formulario } from '../formulario/formulario';
import { UsuarioListar } from '../models/usuario';


@Component({
  selector: 'app-cadastrocliente',
  imports: [RouterModule, FormsModule, CommonModule, Formulario],
  templateUrl: './cadastrocliente.html',
  styleUrl: './cadastrocliente.css'
})
export class Cadastrocliente {

  btnAcao = "Cadastrar";
  descTitulo = "Cadastrar Usuários";
  mensagemSucesso: string | null = null;

  constructor(private router: Router, private serviceUsuario: UsuarioService) {
  }

  criarUsuario(usuario: UsuarioListar) {
    console.log(usuario)
    this.serviceUsuario.CriarUsuario(usuario).subscribe(response => {
      this.mensagemSucesso = "Usuário cadastrado com sucesso!";

      setTimeout(() => {
        this.mensagemSucesso = null;
        this.router.navigate(['/TelaPrincipal']);
      }, 3000); // 3 segundos
    });
  }

  irParaTelaPrincipal() {
    this.router.navigate(['/TelaPrincipal']);
  }

  Salvar() {

  }
}
