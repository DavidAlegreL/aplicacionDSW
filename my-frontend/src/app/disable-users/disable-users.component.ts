import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-disable-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './disable-users.component.html',
  styleUrls: ['./disable-users.component.css']
})
export class DisableUsersComponent implements OnInit {
  users: any[] = [];
  disabledUsers: any[] = []; // Lista de usuarios deshabilitados

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('http://localhost:3000/users')
      .subscribe(response => {
        // Separar usuarios habilitados y deshabilitados
        this.users = response.filter(user => !user.isAdmin && !user.isDisabled); // Usuarios habilitados
        this.disabledUsers = response.filter(user => !user.isAdmin && user.isDisabled); // Usuarios deshabilitados
      }, error => {
        console.error('Error al obtener usuarios:', error);
      });
  }

  disableUser(userId: number) {
    const userToDisable = this.users.find(user => user.id === userId); // Encuentra el usuario a deshabilitar
    if (!userToDisable) return;
  
    this.http.put(`http://localhost:3000/users/disable/${userId}`, {})
      .subscribe(() => {
        alert('Usuario deshabilitado');
        // Mover el usuario de la lista de habilitados a la lista de deshabilitados
        this.users = this.users.filter(user => user.id !== userId);
        this.disabledUsers.push({ ...userToDisable, isDisabled: 1 });
      }, error => {
        console.error('Error deshabilitando usuario:', error);
        alert('Error deshabilitando usuario');
      });
  }
  
  enableUser(userId: number) {
    const userToEnable = this.disabledUsers.find(user => user.id === userId); // Encuentra el usuario a habilitar
    if (!userToEnable) return;
  
    this.http.put(`http://localhost:3000/users/enable/${userId}`, {})
      .subscribe(() => {
        alert('Usuario habilitado');
        // Mover el usuario de la lista de deshabilitados a la lista de habilitados
        this.disabledUsers = this.disabledUsers.filter(user => user.id !== userId);
        this.users.push({ ...userToEnable, isDisabled: 0 });
      }, error => {
        console.error('Error habilitando usuario:', error);
        alert('Error habilitando usuario');
      });
  }
}