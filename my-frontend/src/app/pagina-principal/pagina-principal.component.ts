// filepath: c:\Users\David\Desktop\uni\cuarto\SegundoCuatri\DSW\TrabajoLab\aplicacion\my-frontend\src\app\pagina-principal\pagina-principal.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pagina-principal',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pagina-principal.component.html',
  styleUrls: ['./pagina-principal.component.css']
})
export class PaginaPrincipalComponent {}