import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top-up',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './top-up.component.html',
  styleUrls: ['./top-up.component.css']
})
export class TopUpComponent {
  userId: string | null = localStorage.getItem('userId');
  cardNumber: string = ''; // Cambiado a string para manejar espacios
  cvv: string | null = null;
  amount: number | null = null;
  isCardVerified: boolean = false;

  constructor(private http: HttpClient) {}

  // Formatear el número de tarjeta mientras se escribe
  formatCardNumber() {
    // Eliminar todos los espacios existentes
    const rawValue = this.cardNumber.replace(/\s+/g, '');
    // Insertar espacios cada 4 dígitos
    this.cardNumber = rawValue.replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  // Verificar la tarjeta
  verifyCard() {
    if (!this.cardNumber || !this.cvv) {
      alert('Por favor, ingresa el número de tarjeta y el CVV');
      return;
    }


    this.http.post('http://localhost:3001/tarjetas/verify', { cardNumber: this.cardNumber, cvv: this.cvv })
      .subscribe(response => {
        alert('Tarjeta verificada con éxito');
        this.isCardVerified = true;
      }, error => {
        console.error('Error verificando la tarjeta:', error);
        alert('Error verificando la tarjeta');
      });
  }

  // Añadir saldo
  addBalance() {
    if (!this.amount || this.amount <= 0) {
      alert('Por favor, ingresa una cantidad válida');
      return;
    }

    this.http.post('http://localhost:3000/users/top-up', { userId: this.userId, amount: this.amount })
      .subscribe(response => {
        alert('Saldo añadido con éxito');
        this.isCardVerified = false; // Reiniciar el estado
        this.cardNumber = '';
        this.cvv = null;
        this.amount = null;
      }, error => {
        console.error('Error añadiendo saldo:', error);
        alert('Error añadiendo saldo');
      });
  }
}