import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CardService } from '../card.service';

@Component({
  selector: 'app-ver-tarjetas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-tarjetas.component.html',
  styleUrls: ['./ver-tarjetas.component.css']
})
export class VerTarjetasComponent implements OnInit {
  userId: string | null = localStorage.getItem('userId');
  cards: any[] = [];
  
  constructor(private http: HttpClient, private cardService: CardService) {}

  ngOnInit(): void {
    if (this.userId) {
      this.cardService.getUserCards(this.userId).subscribe(
        (response) => {
          this.cards = response.cards;
        },
        (error) => {
          console.error('Error obteniendo tarjetas:', error);
        }
      );
    }
  }

  loadCards(): void {
    this.http.get<any[]>(`http://localhost:3001/tarjetas/user?userId=${this.userId}`)
      .subscribe(
        (response) => {
          this.cards = response; // Asignar las tarjetas obtenidas al array
        },
        (error) => {
          console.error('Error obteniendo tarjetas de crédito:', error);
        }
      );
  }
}