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

  onSubmit() {
    this.http.post('http://localhost:3001/credit-card', this.card)
      .subscribe(response => {
        console.log('Tarjeta añadida:', response);
        alert('Tarjeta añadida exitosamente');
      }, error => {
        console.error('Error añadiendo tarjeta:', error);
        alert('Error añadiendo tarjeta');
      });
  }
}