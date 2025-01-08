import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accesibilidad',
  standalone: true,
  imports: [],
  templateUrl: './accesibilidad.component.html',
  styleUrl: './accesibilidad.component.css'
})
export class AccesibilidadComponent {
  constructor(private router: Router) {}

  // Redirecciona al formulario de contacto
  redirectToContact(): void {
    this.router.navigate(['/formcontacto']);
  }

  // Redirecciona al login del usuario
  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }

}
