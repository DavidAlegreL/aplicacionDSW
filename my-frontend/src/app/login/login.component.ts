import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

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

  constructor(private userService: UserService, private router: Router) {}

  login() {
    if (!this.name || !this.password) {
      console.error('Nombre y contraseña son requeridos');
      return;
    }

    this.userService.login(this.name, this.password).subscribe(
      (response) => {
        console.log('Login exitoso', response);
        console.log('isAdmin recibido del backend:', response.isAdmin);
        alert('Login exitoso');
        localStorage.setItem('userId', response.userId.toString());
        localStorage.setItem('userRole', response.isAdmin ? 'admin' : 'user');
        this.router.navigate(['/pagina-principal']);
      },
      (error) => {
        console.error('Error en el login', error);
        alert('Error en el login: ' + error.error.error);
      }
    );
  }
}