import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pantallacarga',
  standalone: true,
  imports: [],
  templateUrl: './pantallacarga.component.html',
  styleUrl: './pantallacarga.component.css'
})
export class PantallacargaComponent {
  constructor(private router: Router) {}

  
  
  ngOnInit(): void {

    /*$$$$$$$$$$$$$$$$$$FUNCION PARA Redirigir al dashboard correspondiente $$$$$$$$$$$$$$$$$$$$$$$$$$$$*/

    setTimeout(() => {
      
    const userRole: string | null = localStorage.getItem('userRole');
    
      switch (userRole) {
        case 'administrator':
          this.router.navigate(['/dashboardadmin']);
          break;
        case 'technician':
          this.router.navigate(['/dashboardtecni']);
          break;
        case 'supervisor':
          this.router.navigate(['/dashboardsup']);
          break;
      }
    }, 3000); 
  }
}
