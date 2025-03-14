import { Routes } from '@angular/router';
import { Register1Component } from './app-register1/register1.component';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
  { path: 'register', component: Register1Component },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' } 
];