import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  userId: string | null = localStorage.getItem('userId');
  friends: any[] = [];
  friendName: string = ''; // Nombre del amigo a añadir
  selectedFriendId: number | null = null;
  amount: number | null = null;
  moneyRequests: any[] = []; // Lista de solicitudes de dinero

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadFriends();
    this.loadMoneyRequests(); // Cargar solicitudes de dinero al iniciar
  }

  loadFriends() {
    if (this.userId) {
      this.http.get<any[]>(`http://localhost:3000/users/friends/${this.userId}`)
        .subscribe(response => {
          this.friends = response;
        }, error => {
          console.error('Error obteniendo amigos:', error);
        });
    }
  }

  addFriend() {
    if (!this.friendName) {
      alert('Por favor, introduce el nombre del amigo');
      return;
    }
  
    // Verificar que el usuario no se agregue a sí mismo
    if (this.friendName === localStorage.getItem('userName')) {
      alert('No puedes agregarte a ti mismo como amigo');
      return;
    }
  
    this.http.post('http://localhost:3000/users/friends/add', {
      userId: this.userId,
      friendName: this.friendName
    }).subscribe(response => {
      alert('Amigo añadido con éxito');
      this.friendName = '';
      this.loadFriends(); // Recargar la lista de amigos
    }, error => {
      console.error('Error añadiendo amigo:', error);
      alert('Error añadiendo amigo: ' + error.error.error);
    });
  }

  transferMoney() {
    if (!this.selectedFriendId || !this.amount || this.amount <= 0) {
      alert('Por favor, selecciona un amigo y una cantidad válida');
      return;
    }

    this.http.post('http://localhost:3000/users/transfer', {
      userId: this.userId,
      friendId: this.selectedFriendId,
      amount: this.amount
    }).subscribe(response => {
      alert('Transferencia realizada con éxito');
      this.amount = null;
      this.selectedFriendId = null;
    }, error => {
      console.error('Error realizando transferencia:', error);
      alert('Error realizando transferencia');
    });
  }

  requestMoney() {
    if (!this.selectedFriendId || !this.amount || this.amount <= 0) {
      alert('Por favor, selecciona un amigo y una cantidad válida');
      return;
    }

    this.http.post('http://localhost:3000/users/request-money', {
      userId: this.userId,
      friendId: this.selectedFriendId,
      amount: this.amount
    }).subscribe(response => {
      alert('Solicitud de dinero enviada con éxito');
      this.amount = null;
      this.selectedFriendId = null;
    }, error => {
      console.error('Error solicitando dinero:', error);
      alert('Error solicitando dinero');
    });
  }
  loadMoneyRequests() {
    this.http.get<any[]>(`http://localhost:3000/users/money-requests/${this.userId}`)
      .subscribe(requests => {
        this.moneyRequests = requests;
      }, error => {
        console.error('Error obteniendo solicitudes de dinero:', error);
      });
  }

  acceptRequest(requestId: number) {
    this.http.put(`http://localhost:3000/users/request-money/${requestId}`, { action: 'accept' })
      .subscribe(() => {
        alert('Solicitud aceptada');
        this.moneyRequests = this.moneyRequests.filter(req => req.id !== requestId);
        this.loadFriends(); // Opcional: recargar amigos si afecta el saldo
      }, error => {
        console.error('Error aceptando solicitud:', error);
      });
  }

  rejectRequest(requestId: number) {
    this.http.put(`http://localhost:3000/users/request-money/${requestId}`, { action: 'reject' })
      .subscribe(() => {
        alert('Solicitud rechazada');
        this.moneyRequests = this.moneyRequests.filter(req => req.id !== requestId);
      }, error => {
        console.error('Error rechazando solicitud:', error);
      });
  }
}