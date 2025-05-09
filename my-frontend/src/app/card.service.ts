import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private apiUrl = 'http://localhost:3001/tarjetas';

  constructor(private http: HttpClient) {}

  getUserCards(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-user-cards`, {
      params: { userId },
    });
  }
  // Método para añadir saldo a una tarjeta
  addBalance(cardId: number, amount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-balance`, { cardId, amount });
  }
}