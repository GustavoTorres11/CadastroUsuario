import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UsuarioListar } from '../models/usuario';
import { Formulario } from "../formulario/formulario";
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-editar',
  imports: [CommonModule, RouterModule, Formulario],
  templateUrl: './editar.html',
  styleUrl: './editar.css',
  standalone: true

})
export class Editar implements OnInit {

  btnAcao = "Editar";
  descTitulo = "Editar Usuário"
  usuarioForm!: FormGroup;
  usuario: UsuarioListar | undefined;
  mensagemSucesso: string = ""; ///////////


  constructor(private UsuarioService: UsuarioService, private router: Router, private route: ActivatedRoute) { }



  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log(1);

    if (id) {
      this.UsuarioService.GetUsuarioId(id).subscribe(response => {
        console.log(2)
        this.usuario = response;
      });
    } else {
      console.error("ID não encontrado na rota!");
    }
  }

 editarUsuario(usuario: UsuarioListar) {
  this.UsuarioService.EditarUsuario(usuario).subscribe(response => {
    this.router.navigate(['/TelaPrincipal'], {
      queryParams: { msg: 'Usuário editado com sucesso!' }
    });
  });
}


}
