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

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadFriends();
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

    this.http.post('http://localhost:3000/users/friends/add', {
      userId: this.userId,
      friendName: this.friendName
    }).subscribe(response => {
      alert('Amigo añadido con éxito');
      this.friendName = '';
      this.loadFriends(); // Recargar la lista de amigos
    }, error => {
      console.error('Error añadiendo amigo:', error);
      alert('Error añadiendo amigo');
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
}