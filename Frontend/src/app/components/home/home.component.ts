import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private router: Router) {}
  addGlow: boolean = false; 
  ngOnInit(): void {
    setTimeout(() => {
      this.addGlow = true;
      setTimeout(() => {
        this.router.navigate(['/accesibilidad']); 
      }, 2000); // Tiempo para redirigir después del contorno
    }, 3000); // Tiempo para activar el contorno
  }
}
