import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register1',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './app-register1.component.html',
  styleUrls: ['./app-register1.component.css']
})
export class Register1Component {
  name?: string;
  pwd1?: string;
  pwd2?: string;

  constructor(private service: UserService) {}

  registrar() {
    if (this.pwd1 !== this.pwd2) {
      console.error('Las contraseñas no coinciden');
      return;
    }

    this.service.register1(this.name!, this.pwd1!, this.pwd2!).subscribe(
      (response) => {
        console.log('Registro exitoso', response);
        alert('Usuario registrado con éxito');
      },
      (error) => {
        console.error('Error en el registro', error);
        alert('Error en el registro: ' + error.error.error);
      }
    );
  }
}