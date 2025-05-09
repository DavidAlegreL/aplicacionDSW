// filepath: c:\Users\David\Desktop\uni\cuarto\SegundoCuatri\DSW\TrabajoLab\aplicacion\my-frontend\src\app\add-card\add-card.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.css']
})
export class AddCardComponent {
  card = {
    cardType: '',
    cardNumber: '',
    cvv: '',
    userId: ''
  };

  constructor(private http: HttpClient) {}

<<<<<<< HEAD
  async ngOnInit() {
    // Inicializar Stripe
    this.stripe = await loadStripe('pk_test_51RJHbY00mVaZlVqdS1kfaMj7rlz9TTJsPIdv8YFu4qXTRdeCvr0Qmt3WfC3r0AmPNcgPcs8q3Y5p1kjRXPZZOOXk00SxO09d8M'); // Reemplaza con tu clave pública
    if (this.stripe) {
      this.elements = this.stripe.elements();
      this.cardElement = this.elements.create('card');
      this.cardElement.mount('#card-element'); // Montar el elemento de la tarjeta en el contenedor
    }
  }

  async addCard() {
    if (!this.stripe || !this.cardElement) {
      alert('Stripe no está inicializado');
      return;
    }

    // Crear un método de pago
    const { paymentMethod, error } = await this.stripe.createPaymentMethod({
      type: 'card',
      card: this.cardElement,
    });

    if (error) {
      console.error('Error creando método de pago:', error.message);
      alert('Error creando método de pago');
    } else {
      console.log('Método de pago creado:', paymentMethod);
      alert('Tarjeta añadida exitosamente');
    }
=======
  onSubmit() {
    this.http.post('http://localhost:3001/credit-card', this.card)
      .subscribe(response => {
        console.log('Tarjeta añadida:', response);
        alert('Tarjeta añadida exitosamente');
      }, error => {
        console.error('Error añadiendo tarjeta:', error);
        alert('Error añadiendo tarjeta');
      });
>>>>>>> parent of 2968b7e4 (cambios en el fronted e intento de creacion de tarjetas con stripe)
  }
}