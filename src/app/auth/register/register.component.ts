import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';
import { passwordMatchValidator } from '../../utils/passwordMatchValidator';
import { RegisterDto } from '../interfaces/auth.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm!: FormGroup; // Declaramos nuestro FormGroup
  // Exponemos las señales del AuthService para usarlas en la plantilla

  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  isLoading = this.authService.isLoading;
  authError = this.authService.authError;
  constructor(
    // private fb: FormBuilder, // Inyectamos FormBuilder para construir el formulario
    // private authService: AuthService, // Inyectamos el AuthService
    // private router: Router // Inyectamos Router para navegar
  ) {}

  ngOnInit(): void {
    // Inicializamos el formulario en ngOnInit
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]], // Mínimo 6 caracteres
      confirmPassword: ['', Validators.required], // Campo para confirmar contraseña
      userType: ['', Validators.required], // Podría ser un Select
      businessName: ['', Validators.required],
      nit: ['', Validators.required], // Puedes añadir un validador de patrón si el formato es estricto
      businessType: [''] // Opcional, puede no ser requerido en el formulario si no siempre aplica
    }, {
      // Añadimos el validador personalizado al FormGroup para que compare contraseñas
      validator: passwordMatchValidator('password', 'confirmPassword')
    });
  }

  // Getter para fácil acceso a los controles en la plantilla
  get formControls() {
    return this.registerForm.controls;
  }

  // Método que se llama cuando se envía el formulario
  onSubmit(): void {
    // Si el formulario no es válido (por validadores requeridos, email, minLength, etc.), no hacemos nada
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched(); // Marca todos los controles como tocados para mostrar errores
      return;
    }

    // Obtener los datos del formulario. Como usamos Reactive Forms, el valor coincide con el DTO.
    // Excluimos confirmPassword ya que no lo enviamos al backend
    const registerData: RegisterDto = {
       first_name: this.formControls['firstName'].value,
       last_name: this.formControls['lastName'].value,
       email: this.formControls['email'].value,
       password_hash: this.formControls['password'].value,
       user_type: this.formControls['userType'].value,
       business_name: this.formControls['businessName'].value,
       nit: this.formControls['nit'].value,
       business_type: this.formControls['businessType'].value,
    };


    // Llamar al método register del AuthService y suscribirse al resultado
    this.authService.register(registerData).subscribe({
      next: (response) => {
        // Si la respuesta es exitosa (el backend retornó 201 y tap no lanzó error)
        // Nota: AuthService ya maneja el tap para loggear y setState(false) isLoading
        if (response) { // AuthService.register retorna null en caso de error
            console.log('Registro exitoso en componente',response);
            // Redirigir al usuario a la página de login después de un registro exitoso
            // this.router.navigate(['/login']);

        }
         // Si response es null, significa que AuthService ya manejó el error (authError signal)
      },
      error: (err) => {
        // Aunque AuthService ya captura errores, este 'error' callback en subscribe
        // es útil si el error no fue manejado por catchError en el servicio.
        // En nuestro AuthService, catchError retorna of(null), por lo que este bloque
        // de 'error' aquí podría no ser llamado si el error se manejó en el servicio.
        console.error('Error en subscribe del componente', err);
        // El mensaje de error ya debería estar en authService.authError signal
      }
    });
  }
}
