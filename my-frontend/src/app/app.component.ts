import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Register1Component } from "./app-register1/register1.component";
import { LoginComponent } from "./login/login.component";
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Register1Component, LoginComponent, MatToolbarModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
