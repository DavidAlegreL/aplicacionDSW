import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Route } from '@angular/router';
import { AppComponent } from './app/app.component';
import { WelcomeComponent } from './app/welcome/welcome.component';
import { Register1Component } from './app/app-register1/register1.component';
import { AddCardComponent } from './app/add-card/add-card.component';
import { LoginComponent } from './app/login/login.component';
import { PaginaPrincipalComponent } from './app/pagina-principal/pagina-principal.component';
import { VerTarjetasComponent } from './app/ver-tarjetas/ver-tarjetas.component';
import { EditarPerfilComponent } from './app/editar-perfil/editar-perfil.component';
import { provideHttpClient } from '@angular/common/http';
import { TopUpComponent } from './app/top-up/top-up.component';
import { DisableUsersComponent } from './app/disable-users/disable-users.component';

const routes: Route[] = [
  { path: '', component: WelcomeComponent },
  { path: 'register', component: Register1Component },
  { path: 'login', component: LoginComponent },
  { path: 'user-profile', component: PaginaPrincipalComponent },
  { path: 'edit-profile', component: EditarPerfilComponent },
  { path: 'card', component: AddCardComponent },
  { path: 'pagina-principal', component: PaginaPrincipalComponent },
  { path: 'ver-tarjetas', component: VerTarjetasComponent },
  { path: 'top-up', component: TopUpComponent },
  { path: 'disable-users', component: DisableUsersComponent } 
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ],
});