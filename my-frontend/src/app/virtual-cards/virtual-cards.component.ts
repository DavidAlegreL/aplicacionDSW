import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-virtual-cards',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './virtual-cards.component.html',
  styleUrls: ['./virtual-cards.component.css']
})
export class VirtualCardsComponent {
  name: string = '';
  email: string = '';
  billingAddress = {
    line1: '',
    city: '',
    postal_code: '',
    country: ''
  };
  cardResponse: any = null;

  constructor(private http: HttpClient) {}

  createVirtualCard() {
    const cardData = {
      userId: localStorage.getItem('userId'), // Obtener el ID del usuario desde el localStorage
      name: this.name,
      email: this.email,
      billingAddress: this.billingAddress,
    };

    this.http.post('http://localhost:3001/tarjetas/create-virtual-card', cardData).subscribe(
      (response: any) => {
        this.cardResponse = response.card; // Guardar la información de la tarjeta en cardResponse
        alert('Tarjeta virtual creada con éxito');
      },
      (error) => {
        console.error('Error creando tarjeta virtual:', error);
        alert('Error creando tarjeta virtual');
      }
    );
  }
}