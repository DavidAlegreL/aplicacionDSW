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
import { TopUpComponent } from './app/top-up/top-up.component';
import { provideHttpClient } from '@angular/common/http';
import { DisableUsersComponent } from './app/disable-users/disable-users.component';
import { FriendsComponent } from './app/friends/friends.component';
<<<<<<< HEAD
import { VirtualCardsComponent } from './app/virtual-cards/virtual-cards.component'; 
import { CatalogComponent } from './app/catalog/catalog.component';
=======
>>>>>>> parent of 2968b7e4 (cambios en el fronted e intento de creacion de tarjetas con stripe)

const routes: Route[] = [
  { path: '', component: WelcomeComponent },
  { path: 'register', component: Register1Component },
  { path: 'login', component: LoginComponent },
  { path: 'add-card', component: AddCardComponent },
  { path: 'pagina-principal', component: PaginaPrincipalComponent },
  { path: 'ver-tarjetas', component: VerTarjetasComponent },
  { path: 'edit-profile', component: EditarPerfilComponent },
  { path: 'top-up', component: TopUpComponent },
  { path: 'friends', component: FriendsComponent },
  { path: 'disable-users', component: DisableUsersComponent },
  { path: 'catalog', component: CatalogComponent },
  { path: 'virtual-cards', component: VirtualCardsComponent } 
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ],
});