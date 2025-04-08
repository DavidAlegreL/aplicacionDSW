import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pagina-principal',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pagina-principal.component.html',
  styleUrls: ['./pagina-principal.component.css']
})
export class PaginaPrincipalComponent implements OnInit {
  userId: string | null = localStorage.getItem('userId'); // Obtener el ID del usuario desde el almacenamiento local
  transactions: any[] = []; // Almacenar las transacciones del usuario

  constructor(private http: HttpClient) {}

  ngOnInit() {
    if (this.userId) {
      this.http.get<any[]>(`http://localhost:3000/users/transactions/${this.userId}`)
        .subscribe(response => {
          this.transactions = response; // Guardar las transacciones en la variable
        }, error => {
          console.error('Error obteniendo transacciones:', error);
        });
    }
  }
}