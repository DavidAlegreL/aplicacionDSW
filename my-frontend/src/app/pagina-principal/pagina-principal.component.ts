import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CardService } from '../card.service'; 

@Component({
  selector: 'app-pagina-principal',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // Asegurarse de incluir FormsModule
  templateUrl: './pagina-principal.component.html',
  styleUrls: ['./pagina-principal.component.css']
})
export class PaginaPrincipalComponent implements OnInit {
  isAdmin: boolean = false;
  userId: string | null = localStorage.getItem('userId'); // Obtener el ID del usuario desde el almacenamiento local
  userName: string | null = localStorage.getItem('userName'); // Obtener el nombre del usuario desde el almacenamiento local
  transactions: any[] = []; // Almacenar las transacciones del usuario
  balance: number | null = null; // Almacenar el balance del usuario
  cards: any[] = []; // Almacenar las tarjetas del usuario
  splitAmount: number = 0; // Monto total a dividir
  additionalParticipants: string = ''; // IDs adicionales ingresados manualmente
  purchases: any[] = []; // Almacenar las compras del usuario

  constructor(private http: HttpClient, private cardService: CardService) {
    const userRole = localStorage.getItem('userRole');
    this.isAdmin = userRole === 'admin';
  }

  ngOnInit() {
    if (this.userId) {
      this.loadTransactions();
      this.loadBalance();
      this.loadPurchases();
      this.cardService.getUserCards(this.userId).subscribe(
        (response) => {
          this.cards = response.cards;
        },
        (error) => {
          console.error('Error obteniendo tarjetas:', error);
        }
      );
    } else {
      console.error('No se encontró el ID del usuario en el localStorage.');
    }
  }

  loadTransactions() {
    this.http.get<any[]>(`http://localhost:3000/users/transactions/${this.userId}`)
      .subscribe(
        (response) => {
          this.transactions = response; // Guardar las transacciones en la variable
        },
        (error) => {
          console.error('Error obteniendo transacciones:', error);
        }
      );
  }

  loadBalance() {
    this.http.get<{ balance: number }>(`http://localhost:3000/users/balance/${this.userId}`)
      .subscribe(
        (response) => {
          this.balance = response.balance; // Guardar el balance en la variable
        },
        (error) => {
          console.error('Error obteniendo balance:', error);
        }
      );
  }
  loadPurchases(): void {
    this.http.get<any[]>(`http://localhost:3000/users/purchases/${this.userId}`).subscribe(
      (response) => {
        this.purchases = response;
      },
      (error) => {
        console.error('Error obteniendo compras:', error);
      }
    );
  }

  splitPayment() {
    if (!this.splitAmount || this.splitAmount <= 0) {
      alert('Por favor, ingresa un monto válido.');
      return;
    }

    // Combinar el ID del usuario actual con los IDs adicionales
    const participants = [this.userId, ...this.additionalParticipants.split(',').map((id) => id.trim())].filter(
      (id) => id
    );

    if (participants.length === 0) {
      alert('Por favor, ingresa al menos un participante.');
      return;
    }

    const payload = {
      payerId: this.userId,
      amount: this.splitAmount,
      participants: participants,
    };

    this.http.post('http://localhost:3000/users/split-payment', payload).subscribe(
      (response) => {
        console.log('Pago dividido con éxito:', response);
        alert('Pago dividido con éxito');
      },
      (error) => {
        console.error('Error dividiendo el pago:', error);
        alert('Error dividiendo el pago');
      }
    );
  }
}