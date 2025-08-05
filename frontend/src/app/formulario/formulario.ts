import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../services/usuario';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuarioListar } from '../models/usuario';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { Editar } from '../editar/editar';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './formulario.html',
  styleUrl: './formulario.css'
})
export class Formulario implements OnInit {
  @Input() btnAcao!: string;
  @Input() descTitulo!: string;
  @Input() dadosUsuario: UsuarioListar | null = null;

  @Output() onSubmit = new EventEmitter<UsuarioListar>();

  usuarioForm!: FormGroup;
  mode: 'create' | 'edit' = 'create';
  private activatedRoute = inject(ActivatedRoute);

  constructor(private router: Router, private serviceUsuario: UsuarioService) {
  }

  // não trazer a senha no editar
  ngOnInit(): void {
    this.activatedRoute.url.subscribe({
      next: (result) => {
        result?.map(item => {
          if (item.path == 'editar') {
            this.mode = 'edit';

          }
        })
      }
    });

    

    this.usuarioForm = new FormGroup({
      id: new FormControl(this.dadosUsuario?.id ?? 0),
      nome: new FormControl(this.dadosUsuario?.nome ?? ''),
      email: new FormControl(this.dadosUsuario?.email ?? ''),
      senha: new FormControl(this.dadosUsuario?.senha ?? ''),
      telefone: new FormControl(this.dadosUsuario?.telefone ?? ''),
      cpf: new FormControl(this.dadosUsuario?.cpf ?? ''),
      endereco: new FormControl(this.dadosUsuario?.endereco ?? ''),
    });
  }

  irParaTelaPrincipal() {
    this.router.navigate(['/TelaPrincipal']);
  }

  submit() {
    this.onSubmit.emit(this.usuarioForm.value);
  }

  Salvar() {
    this.submit();
  }
}
