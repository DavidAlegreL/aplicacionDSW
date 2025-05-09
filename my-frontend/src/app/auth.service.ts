import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  private userIdSubject = new BehaviorSubject<Number | null>(null);

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  isAdmin$ = this.isAdminSubject.asObservable();
  userId$ = this.userIdSubject.asObservable();

  setAuthState(isLoggedIn: boolean, isAdmin: boolean, userId: Number | null): void {
    // Asegurarse de que los valores sean consistentes
    this.isLoggedInSubject.next(isLoggedIn);
    this.isAdminSubject.next(isAdmin);
    this.userIdSubject.next(userId);

    // Actualizar localStorage para persistencia
    if (isLoggedIn && userId) {
      localStorage.setItem('userId', userId.toString());
      localStorage.setItem('isAdmin', isAdmin.toString());
    } else {
      this.clearAuthState(); // Limpia todo si no hay sesión válida
    }
  }

  clearAuthState(): void {
    // Reiniciar el estado de autenticación
    this.isLoggedInSubject.next(false);
    this.isAdminSubject.next(false);
    this.userIdSubject.next(null);

    // Limpiar localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('isAdmin');
  }

  getAuthState(): { isLoggedIn: boolean; isAdmin: boolean; userId: Number | null } {
    return {
      isLoggedIn: this.isLoggedInSubject.value,
      isAdmin: this.isAdminSubject.value,
      userId: this.userIdSubject.value
    };
  }
}