import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-google-auth-callback',
  imports: [],
  templateUrl: './GoogleAuthCallback.component.html',
  styleUrl: './GoogleAuthCallback.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoogleAuthCallbackComponent {
  constructor(
    private route: ActivatedRoute, // Para acceder a los parámetros de la URL
    private router: Router,
    private authService: AuthService // Para usar el AuthService
  ) {}

  ngOnInit(): void {
    // Leer el parámetro 'token' que el backend añadió a la URL de redirección
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      console.log('Callback: Token recibido, procesando...'); // Debugging
      // Usar el AuthService para procesar este token.
      // Nuestro AuthService.login ya guarda el token y actualiza el estado.
      // Opcional: Podrías crear un método específico en AuthService como processExternalToken(token: string)
      // que solo guarde el token y actualice señales sin hacer la llamada HTTP al backend.
      // Por simplicidad, podemos llamar a un método en AuthService que simule el login exitoso con este token.

      // Simulamos la actualización del estado de login en el AuthService
      this.authService.setTokenAndUserState(token); // <-- Necesitas añadir este nuevo método en AuthService

      // Redirigir al dashboard inmediatamente después de procesar el token
      this.router.navigate(['/dashboard']);

    } else {
      // Si no hay token en la URL, algo salió mal en el backend o en la redirección de Google
      console.error('Callback: No se recibió token en la URL.'); // Debugging
      // Puedes mostrar un error al usuario o redirigirlo al login con un mensaje de error
      this.router.navigate(['/login'], { queryParams: { error: 'google_auth_failed' } });
    }
  }

}
