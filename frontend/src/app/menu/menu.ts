import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu {

  constructor(private readonly router: Router) { }

  Sair() {
    localStorage.clear()
    this.router.navigate(['/login'])
  }
}
