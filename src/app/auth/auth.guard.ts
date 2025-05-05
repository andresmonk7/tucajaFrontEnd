import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Inyecta AuthService
  const router = inject(Router); // Inyecta Router

  // Accede al valor actual de la señal isLoggedIn
  const isLoggedIn = authService.isLoggedIn();

  if (isLoggedIn) {
    return true; // Permite la activación de la ruta si está logueado
  } else {
    // Si no está logueado, redirige a la página de login
    console.log('Usuario no autenticado, redirigiendo a login...'); // Debugging
    router.navigate(['/login']);
    return false; // Impide la activación de la ruta
  }

  }
