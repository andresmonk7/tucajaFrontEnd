// src/app/auth/auth.types.ts

// Asegúrate de que coincida con tu RegisterDto en el backend
export interface RegisterDto {
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  user_type: string;
  business_name: string;
  nit: string;
  business_type?: string; // Opcional
}

// Asegúrate de que coincida con tu LoginDto en el backend
export interface LoginDto {
  email: string;
  password_hash: string;
}

// Asegúrate de que coincida con la respuesta de tu API de login
export interface AuthResponse {
  accessToken: string;
}

// Opcional: Interfaz para los datos básicos del usuario obtenidos del token
export interface CurrentUser {
  userId: number; // O string/UUID dependiendo de tu DB
  email: string;
  // ... otros claims del token si los añades
}

export interface Login {
    email: string;
    password_hash:string;
}
