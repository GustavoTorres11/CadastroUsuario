import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Menu } from "./menu/menu";
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Menu, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected title = 'Telalogin';

  temaEscuro = false;
  showMenu = false;

  constructor(private readonly router: Router,) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const currentUrl = this.router.url;
      this.showMenu = !(currentUrl.includes('/login')) && !(currentUrl.includes('/cadastro'));
    });
  }

  Menu(): void {
    this.showMenu = !this.showMenu;
  }

  alternarTema(): void {
    this.temaEscuro = !this.temaEscuro;

    // if (this.temaEscuro) {
    //   this.renderer.addClass(document.body, 'tema-escuro');
    // } else {
    //   this.renderer.removeClass(document.body, 'tema-escuro');
    // }
  }
}