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
  isAdmin: boolean = false;
  userId: string | null = localStorage.getItem('userId'); // Obtener el ID del usuario desde el almacenamiento local
  transactions: any[] = []; // Almacenar las transacciones del usuario
  balance: number | null = null; // Almacenar el balance del usuario

  constructor(private http: HttpClient) {
    const userRole = localStorage.getItem('userRole');
    this.isAdmin = userRole === 'admin';
  }

  ngOnInit() {
    if (this.userId) {
      this.loadTransactions();
      this.loadBalance();
    }
  }

  loadTransactions() {
    this.http.get<any[]>(`http://localhost:3000/users/transactions/${this.userId}`)
      .subscribe(response => {
        this.transactions = response; // Guardar las transacciones en la variable
      }, error => {
        console.error('Error obteniendo transacciones:', error);
      });
  }

  loadBalance() {
    this.http.get<{ balance: number }>(`http://localhost:3000/users/balance/${this.userId}`)
      .subscribe(response => {
        this.balance = response.balance; // Guardar el balance en la variable
      }, error => {
        console.error('Error obteniendo balance:', error);
      });
  }
}