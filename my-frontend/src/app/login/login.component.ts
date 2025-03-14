import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  name?: string;
  password?: string;

  constructor(private userService: UserService) {}

  login() {
    if (!this.name || !this.password) {
      console.error('Nombre y contraseña son requeridos');
      return;
    }

    this.userService.login(this.name, this.password).subscribe(
      (response) => {
        console.log('Login exitoso', response);
        alert('Login exitoso');
      },
      (error) => {
        console.error('Error en el login', error);
        alert('Error en el login: ' + error.error.error);
      }
    );
  }
}