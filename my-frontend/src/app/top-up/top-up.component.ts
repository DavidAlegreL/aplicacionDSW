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
export class TopUpComponent implements OnInit {
  userId: string | null = localStorage.getItem('userId'); // Obtener el ID del usuario desde el localStorage
  cards: any[] = []; // Lista de tarjetas del usuario
  selectedCardId: number | null = null; // ID de la tarjeta seleccionada
  amount: number | null = null; // Cantidad a recargar

  constructor(private cardService: CardService) {}

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
  }
}