import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario';
import { UsuarioListar } from '../models/usuario';
import { CommonModule, NgIf } from '@angular/common';


@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.html',
  styleUrls: ['./usuario.css'],
  imports: [CommonModule]
})
export class Usuario implements OnInit {

  usuario: UsuarioListar = {} as UsuarioListar;

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.usuarioService.GetUsuario().subscribe({
      next: (response) => {
        console.log('Dados recebidos:', response);
        this.usuario = response;
      },
      error: (err) => {
        console.error('Erro ao buscar usuário:', err);
      }
    });
  }

  getIniciais(): string {
  if (!this.usuario?.nome) return '';
  const partes = this.usuario.nome.split(' ');
  const primeira = partes[0]?.charAt(0) ?? '';
  const segunda = partes[1]?.charAt(0) ?? '';
  return primeira + segunda;
}

}