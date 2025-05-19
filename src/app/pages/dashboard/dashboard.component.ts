import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { StatCardComponent } from "../../components/StatCard/StatCard.component";
import { ChartSectionComponent } from "../../components/ChartSection/ChartSection.component";
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-dashboard',
  imports: [StatCardComponent, ChartSectionComponent, HeaderComponent],
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
