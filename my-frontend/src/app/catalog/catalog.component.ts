import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Importar CommonModule

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule], // Asegurarse de incluir CommonModule
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  products: any[] = []; // Lista de productos
  userId: string | null = localStorage.getItem('userId'); // Obtener el ID del usuario desde el localStorage

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCatalog(); // Cargar el catálogo al iniciar el componente
  }

  // Método para cargar el catálogo de productos
  loadCatalog(): void {
    this.http.get<any[]>('http://localhost:3000/users/catalog').subscribe(
      (response) => {
        this.products = response; // Guardar los productos en la variable
      },
      (error) => {
        console.error('Error cargando el catálogo:', error);
      }
    );
  }

  // Método para realizar una compra
  purchaseProduct(productId: number): void {
    if (!this.userId) {
      alert('Por favor, inicia sesión para realizar una compra.');
      return;
    }

    this.http.post('http://localhost:3000/users/purchase', {
      userId: this.userId,
      productId
    }).subscribe(
      (response: any) => {
        alert(`Compra realizada con éxito. Tu nuevo saldo es: ${response.newBalance} €`);
        this.loadCatalog(); // Recargar el catálogo si es necesario
      },
      (error) => {
        console.error('Error realizando la compra:', error);
        alert(error.error.error || 'Error realizando la compra.');
      }
    );
  }
}