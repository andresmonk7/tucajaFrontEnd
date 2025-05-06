import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './auth/auth.guard';
import { GoogleAuthCallbackComponent } from './auth/GoogleAuthCallback/GoogleAuthCallback.component';

export const routes: Routes = [
  {
    path:'', pathMatch:'full', redirectTo:'login'
  },
  {
    path: 'register', component: RegisterComponent
  },
  {
    path: 'login', component:LoginComponent
  },
  {
    path:'dashboard', component:DashboardComponent,
    canActivate: [authGuard]
  },
  {
    // Esta ruta debe coincidir con la 'redirect URI' en tu backend que redirige al frontend
    path: 'login/google/callback', // <-- Define la ruta del callback en el frontend
    component: GoogleAuthCallbackComponent // <-- Componente que manejará el token
  },
];
