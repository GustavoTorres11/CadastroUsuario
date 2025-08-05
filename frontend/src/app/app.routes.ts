import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Cadastro } from './cadastro/cadastro';
import { Home } from './home/home';
import { AdminDashboard } from './admin/admin-dashboard';
import { AdminGuard } from './admin/admin.guard';
import { TelaPrincipal } from './tela-principal/tela-principal';
import { Menu } from './menu//menu';
import { Cadastrocliente } from './cadastrocliente/cadastrocliente';
import { Editar } from './editar/editar';
import { Usuario } from './usuario/usuario';


export const routes: Routes = [
    { path: '', redirectTo: 'TelaPrincipal', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'cadastro', component: Cadastro },
    { path: 'home', component: Home },
    { path: 'TelaPrincipal', component: TelaPrincipal },
    { path: 'cadastrocliente', component: Cadastrocliente },
    { path: 'editar/:id', component: Editar },
    { path: 'usuario', component: Usuario },
    { path: '**', redirectTo: 'TelaPrincipal', pathMatch: 'full' },

    {
        path: 'admin',
        canActivate: [AdminGuard],
        children: [
            { path: '', component: AdminDashboard },
            { path: 'outra-coisa', component: AdminDashboard },
        ]
    }
];
