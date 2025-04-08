import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-disable-users',
  standalone: true,
  templateUrl: './disable-users.component.html',
  styleUrls: ['./disable-users.component.css']
})
export class DisableUsersComponent implements OnInit {
  users: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('http://localhost:3000/users')
      .subscribe(response => {
        this.users = response.filter(user => !user.isAdmin); // Excluir administradores
      });
  }

  disableUser(userId: number) {
    this.http.put(`http://localhost:3000/users/disable/${userId}`, {})
      .subscribe(() => {
        alert('Usuario deshabilitado');
        this.users = this.users.filter(user => user.id !== userId);
      });
  }
}