import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  constructor(private router: Router) {}
  logo = '/logo2.png';

  logout(): void {
    // Lógica para cerrar sesión
    localStorage.removeItem('token'); // Ejemplo: eliminar token
    this.router.navigate(['/login']); // Redirigir al login
  }
}
