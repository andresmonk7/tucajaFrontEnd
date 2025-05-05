import { AbstractControl, ValidatorFn } from "@angular/forms";

export function passwordMatchValidator(controlName: string, matchingControlName: string): ValidatorFn {
  return (formGroup: AbstractControl): { [key: string]: any } | null => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    if (!control || !matchingControl) {
      return null; // Retorna si los controles no existen
    }

    // set errors on matchingControl if validation fails
    if (matchingControl.errors && !matchingControl.errors['passwordMatch']) {
      return null; // Retorna si el control de confirmación ya tiene otros errores
    }

    // Compara las contraseñas
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ passwordMatch: true }); // Establece el error si no coinciden
    } else {
      matchingControl.setErrors(null); // Elimina el error si coinciden
    }

    return null; // Esta validación no afecta al control principal, solo al de confirmación
  };
}
