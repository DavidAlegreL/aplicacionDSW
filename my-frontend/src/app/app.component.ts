import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Register1Component } from "./app-register1/register1.component";
import { LoginComponent } from "./login/login.component";
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AddCardComponent } from './add-card/add-card.component';
import { VerTarjetasComponent } from './ver-tarjetas/ver-tarjetas.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Register1Component,
    LoginComponent,
    NavBarComponent,
    MatToolbarModule,
    MatButtonModule,
    AddCardComponent,
    VerTarjetasComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
}