import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Route } from '@angular/router';
import { AppComponent } from './app/app.component';
import { WelcomeComponent } from './app/welcome/welcome.component';
import { Register1Component } from './app/app-register1/register1.component';
import { LoginComponent } from './app/login/login.component';

const routes: Route[] = [
  { path: '', component: WelcomeComponent },
  { path: 'register', component: Register1Component },
  { path: 'login', component: LoginComponent },
  // otras rutas...
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
  ],
});