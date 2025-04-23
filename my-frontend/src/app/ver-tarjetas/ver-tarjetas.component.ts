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
  cards: any[] = []; // Array para almacenar las tarjetas del usuario
  userId: string | null = null; // ID del usuario obtenido del localStorage

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.userId = localStorage.getItem('userId'); // Obtener el ID del usuario del localStorage
    if (this.userId) {
      this.loadCards(); // Cargar las tarjetas del usuario
    } else {
      console.error('No se encontró el ID del usuario en el localStorage.');
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