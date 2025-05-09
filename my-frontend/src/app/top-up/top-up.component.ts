import { Component, OnInit } from '@angular/core';
import { CardService } from '../card.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top-up',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './top-up.component.html',
  styleUrls: ['./top-up.component.css']
})
<<<<<<< HEAD
export class TopUpComponent implements OnInit {
  userId: string | null = localStorage.getItem('userId'); // Obtener el ID del usuario desde el localStorage
  cards: any[] = []; // Lista de tarjetas del usuario
  selectedCardId: number | null = null; // ID de la tarjeta seleccionada
  amount: number | null = null; // Cantidad a recargar
=======
export class TopUpComponent {
  userId: string | null = localStorage.getItem('userId');
  cardNumber: string = ''; // Cambiado a string para manejar espacios
  cvv: string | null = null;
  amount: number | null = null;
  isCardVerified: boolean = false;
>>>>>>> parent of 2968b7e4 (cambios en el fronted e intento de creacion de tarjetas con stripe)

  constructor(private cardService: CardService) {}

<<<<<<< HEAD
  ngOnInit(): void {
    this.loadUserCards(); // Cargar las tarjetas del usuario al iniciar el componente
  }

  // Método para cargar las tarjetas del usuario
  loadUserCards(): void {
    if (this.userId) {
      this.cardService.getUserCards(this.userId).subscribe(
        (response) => {
          this.cards = response.cards; // Guardar las tarjetas en la variable
        },
        (error: any) => {
          console.error('Error obteniendo tarjetas del usuario:', error);
        }
      );
    }
  }

  // Método para seleccionar una tarjeta
  selectCard(cardId: number): void {
    this.selectedCardId = cardId; // Guardar el ID de la tarjeta seleccionada
  }

  // Método para añadir saldo a la tarjeta seleccionada
  addBalance(): void {
    if (!this.selectedCardId || !this.amount || this.amount <= 0) {
      alert('Por favor, selecciona una tarjeta y una cantidad válida');
      return;
    }

    this.cardService.addBalance(this.selectedCardId, this.amount).subscribe(
      (response: any) => {
        alert('Saldo añadido con éxito');
        this.amount = null; // Reiniciar el monto
        this.selectedCardId = null; // Reiniciar la tarjeta seleccionada
      },
      (error: any) => {
        console.error('Error añadiendo saldo:', error);
        alert('Error añadiendo saldo');
      }
    );
=======
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
>>>>>>> parent of 2968b7e4 (cambios en el fronted e intento de creacion de tarjetas con stripe)
  }
}