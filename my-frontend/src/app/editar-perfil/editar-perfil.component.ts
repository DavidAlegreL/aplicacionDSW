import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css']
})
export class EditarPerfilComponent implements OnInit {
  userId: string | null = null;
  userProfile: any = {
    realName: '',
    email: '',
    phone: '',
    adress: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    if (this.userId) {
      this.http.get<any>(`http://localhost:3000/users/profile/${this.userId}`)
        .subscribe(response => {
          this.userProfile = response;
        }, error => {
          console.error('Error obteniendo el perfil del usuario:', error);
        });
    }
  }

  saveProfile() {
    if (this.userId) {
      const { realName, email, phone, address } = this.userProfile;
  
      if (!realName || !email || !phone || !address) {
        alert('Todos los campos son obligatorios');
        return;
      }
  
      this.http.put(`http://localhost:3000/users/profile/${this.userId}`, this.userProfile)
        .subscribe(response => {
          alert('Perfil actualizado con éxito');
        }, error => {
          console.error('Error actualizando el perfil del usuario:', error);
        });
    }
  }
}