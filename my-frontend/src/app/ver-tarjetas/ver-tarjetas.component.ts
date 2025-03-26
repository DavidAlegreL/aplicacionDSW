import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ver-tarjetas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-tarjetas.component.html',
  styleUrls: ['./ver-tarjetas.component.css']
})
export class VerTarjetasComponent implements OnInit {
  cards: any[] = [];

  constructor(private lochttp: HttpClient) {}

  ngOnInit() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.lochttp.get<any[]>(`http://localhost:3001/tarjetas/user?userId=${userId}`)
        .subscribe(response => {
          this.cards = response;
        }, error => {
          console.error('Error obteniendo tarjetas de crédito:', error);
        });
    }
  }
}