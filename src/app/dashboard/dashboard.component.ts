import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {

 // Exponemos la señal del usuario actual para usarla en la plantilla
 authService = inject(AuthService);
 currentUser = this.authService.currentUser;

 constructor(
   private router: Router 
 ) {}

 // Método para cerrar sesión
 logout(): void {
   this.authService.logout(); // Llama al método de logout del AuthService
   // AuthService ya redirige a /login después de logout en nuestra implementación
   // Si no lo hiciera, podrías redirigir aquí: this.router.navigate(['/login']);
 }


 }
