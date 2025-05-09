import { Component } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  imports: [],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

<<<<<<< HEAD
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Suscribirse al estado de autenticación
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });

    this.authService.isAdmin$.subscribe((admin) => {
      this.isAdmin = admin;
    });
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout(): void {
  this.authService.setAuthState(false, false, null); // Agregar null como userId
  this.router.navigate(['/login']);
}
}
=======
}
>>>>>>> parent of 2968b7e4 (cambios en el fronted e intento de creacion de tarjetas con stripe)
