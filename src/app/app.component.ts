import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { NgIf } from '@angular/common';
import { AuthService } from './auth/auth.service';
import { HeaderComponent } from "./components/header/header.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, NgIf, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tucaja-frontend';

    authService = inject(AuthService);
  isLoggedIn = this.authService.isLoggedIn(); // Cambia a true o false según el estado de autenticación
}
