import { Injectable, signal } from '@angular/core';
import { AuthResponse, CurrentUser, LoginDto, RegisterDto } from './interfaces/auth.interface';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

   // --- Signals para el estado de autenticación ---
  // Estado si el usuario está logueado
  private _isLoggedIn = signal<boolean>(false);
  // Información básica del usuario logueado (ej: del token)
  private _currentUser = signal<CurrentUser | null>(null);
  // Mensaje de error de autenticación (ej: credenciales inválidas)
  private _authError = signal<string | null>(null);
  // Estado si se está realizando una operación de autenticación (ej: login/registro)
  private _isLoading = signal<boolean>(false);

  // --- Señales de solo lectura (Readonly Signals) para exponer el estado ---
  // Componentes se 'suscriben' a estas señales para reaccionar a los cambios
  public isLoggedIn = this._isLoggedIn.asReadonly();
  public currentUser = this._currentUser.asReadonly();
  public authError = this._authError.asReadonly();
  public isLoading = this._isLoading.asReadonly();

  // URL base de tu backend (definida en environment.ts)
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {
    // Al crear el servicio (al iniciar la app), intentar cargar el token del almacenamiento local
    this.loadToken();
  }

  // Método para intentar cargar el token al iniciar la app
  private loadToken(): void {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Aquí podrías añadir lógica para validar si el token no ha expirado
      // Por ahora, si existe, asumimos que el usuario está logueado
      try {
         const payload = JSON.parse(atob(token.split('.')[1]));
         console.log('payload', payload)// Decodificar payload básico;
         // Puedes añadir validación de expiración: if (payload.exp * 1000 < Date.now()) { ... logout }
         this._currentUser.set({ userId: payload.sub, email: payload.email, name:payload.name }); // Establecer info del usuario
         this._isLoggedIn.set(true); // Marcar como logueado
         console.log('Token encontrado y cargado.'); // Debugging
      } catch (e) {
         console.error('Token inválido o expirado', e); // Si falla la decodificación
         this.logout(); // Cerrar sesión si el token es inválido
      }
    }
  }

  // --- Métodos para interactuar con las APIs de Backend ---

  // Método para registrar un nuevo usuario
  register(registerDto: RegisterDto): Observable<any> {
    this._isLoading.set(true); // Indicar que la operación está cargando
    this._authError.set(null); // Limpiar cualquier error previo

    return this.http.post<any>(`${this.apiUrl}/auth/register`, registerDto).pipe(
      // 'tap' ejecuta efectos secundarios sin modificar el stream de datos
      tap(response => {
        console.log('Registro exitoso', response);
        this._isLoading.set(false); // Finalizar carga
        // No hacemos login automático aquí, el usuario deberá loguearse
      }),
      // 'catchError' captura errores del observable HTTP
      catchError(error => {
        console.error('Error en registro', error);
        // Establecer el mensaje de error en la señal
        this._authError.set('Error al registrar. Inténtalo de nuevo.'); // Mensaje genérico
        // Si necesitas mostrar un mensaje específico del backend, puedes intentar acceder a error.error.message
        this._isLoading.set(false); // Finalizar carga
        // Retornar un observable que emita un valor (como null) para que el componente sepa que hubo un error
        return of(null); // o throwError(() => new Error('...')) si prefieres lanzar el error
      })
    );
  }

  // Método para iniciar sesión
  login(loginDto: LoginDto): Observable<AuthResponse | null> {
    this._isLoading.set(true); // Indicar que la operación está cargando
    this._authError.set(null); // Limpiar errores previos

    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, loginDto).pipe(
      tap(response => {
        // Si el login es exitoso, guardar el token y actualizar señales
        localStorage.setItem('accessToken', response.accessToken);
        // Decodificar token para obtener info básica del usuario
        try {
           const payload = JSON.parse(atob(response.accessToken.split('.')[1]));
           this._currentUser.set({ userId: payload.sub, email: payload.email, name:payload.name }); // Establecer info del usuario
           this._isLoggedIn.set(true); // Marcar como logueado
           console.log('Login exitoso, token guardado.'); // Debugging
        } catch (e) {
           console.error('Error al decodificar el token', e);
           this.logout(); // Si el token es inválido, cerrar sesión
           this._authError.set('Error en el token recibido.'); // Mensaje de error
        }

        this._isLoading.set(false); // Finalizar carga
      }),
      catchError(error => {
        console.error('Error en login', error);
        // Manejar errores específicos (ej: 401 Unauthorized)
         if (error.status === 401) {
             this._authError.set('Email o contraseña incorrectos.');
         } else {
             this._authError.set('Ocurrió un error durante el inicio de sesión.'); // Mensaje genérico
         }
        this._isLoading.set(false); // Finalizar carga
        return of(null); // Retornar null para que el componente lo maneje
      })
    );
  }

  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem('accessToken'); // Eliminar token
    this._isLoggedIn.set(false); // Actualizar señal de logueado
    this._currentUser.set(null); // Limpiar info del usuario
    this._authError.set(null); // Limpiar errores
    console.log('Sesión cerrada.'); // Debugging
    // Opcional: redirigir a la página de login
    this.router.navigate(['/login']);
  }

  // Método para obtener el token (útil para interceptores HTTP)
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }


  setTokenAndUserState(token: string): void {
    if (token) {
       localStorage.setItem('accessToken', token); // Guardar el token
       try {
          const payload = JSON.parse(atob(token.split('.')[1])); // Decodificar payload
          this._currentUser.set({ userId: payload.sub, email: payload.email,name:payload.name }); // Actualizar info del usuario
          this._isLoggedIn.set(true); // Marcar como logueado
          this._authError.set(null); // Limpiar errores
          console.log('AuthService: Token procesado, estado actualizado.'); // Debugging
       } catch (e) {
          console.error('AuthService: Error al decodificar o procesar token', e);
          this.logout(); // Si falla, cerrar sesión
          this._authError.set('Token de autenticación inválido.'); // Mensaje de error
       }
    } else {
       // Si se llama con token nulo o vacío, cerrar sesión
       this.logout();
    }
  }
}
