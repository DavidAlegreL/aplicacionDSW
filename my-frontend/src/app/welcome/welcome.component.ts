// filepath: c:\Users\David\Desktop\uni\cuarto\SegundoCuatri\DSW\TrabajoLab\aplicacion\my-frontend\src\app\welcome\welcome.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {}