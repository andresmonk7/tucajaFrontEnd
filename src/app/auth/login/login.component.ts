
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms'; // Importa FormBuilder, FormGroup, Validators
import { Router, RouterModule } from '@angular/router'; // Importa Router y RouterModule para el link al registro
import { AuthService } from '../auth.service';
import { LoginDto } from '../interfaces/auth.interface';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-login',
  standalone: true, // ¡Debe ser true!
  imports: [
    CommonModule,
    ReactiveFormsModule, // Necesario para usar formularios reactivos
    RouterModule // Necesario para el link routerLink
  ],
  templateUrl: './login.component.html'})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup; // Declaramos nuestro FormGroup
  // Exponemos las señales del AuthService para usarlas en la plantilla
  // authService = inject(AuthService);
  logo = '/logo2.png'

  constructor(
    private fb: FormBuilder, // Inyectamos FormBuilder
    private authService: AuthService, // Inyectamos el AuthService
    private router: Router // Inyectamos Router
  ) {}

  isLoading = signal(false);
  authError =signal<string| null>(null);

  ngOnInit(): void {
    // Inicializamos el formulario en ngOnInit
    this.isLoading.set(this.authService.isLoading());
    this.authError.set(this.authService.authError());
    console.log(this.isLoading());
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Campo de email
      password_hash: ['', Validators.required], // Campo de contraseña
    });
  }

  // Getter para fácil acceso a los controles en la plantilla
  get formControls() {
    return this.loginForm.controls;
  }

  loginWithGoogle(): void {
    // Redirige el navegador a la URL de inicio de Google OAuth en tu backend.
    // El backend se encargará de redirigir a la página de login de Google.
    window.location.href = `${environment.apiUrl}/auth/google`;
  }
  // Método que se llama cuando se envía el formulario
  onSubmit(): void {
    // Si el formulario no es válido, no hacemos nada
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // Marca los controles para mostrar errores
      return;
    }

    // Obtener los datos del formulario (coinciden con LoginDto)
    const loginData: LoginDto = this.loginForm.value;

    // Llamar al método login del AuthService y suscribirse al resultado
    this.authService.login(loginData).subscribe({
      next: (response) => {
        // Si la respuesta es exitosa (AuthService ya guardó el token y actualizó señales)
        if (response) { // AuthService.login retorna null en caso de error
            console.log('Login exitoso en componente',response);
            // Redirigir al usuario a la página principal o dashboard después del login
            // (Necesitarás definir una ruta para el dashboard más adelante)
            this.router.navigate(['/dashboard']); // <-- Cambia '/dashboard' por tu ruta de dashboard
        }
         // Si response es null, significa que AuthService ya manejó el error (authError signal)
      },
      error: (err) => {
        // Este bloque puede no ser llamado si AuthService.catchError retorna of(null)
        console.error('Error en subscribe del componente login', err);
        // El mensaje de error ya debería estar en authService.authError signal
      }
    });
  }
}
