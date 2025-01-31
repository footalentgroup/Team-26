import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { PeticionService } from '../../services/peticion.service';


@Component({
  selector: 'app-navbarsup',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbarsup.component.html',
  styleUrl: './navbarsup.component.css'
})
export class NavbarsupComponent { 
  constructor(private router: Router,private peticion:PeticionService){}
  userName: string = '';
  userRole: string = '';

  ngOnInit() {
    // Recuperar los datos desde el localStorage
    this.userName = localStorage.getItem('userName') || 'Usuario'; 
    this.userRole = localStorage.getItem('userRole') || '';
  }
  

  navegar(ruta: string): void {
      this.router.navigate([ruta]);
  }
  logout() {

    const userId = localStorage.getItem('userId'); 
    const url = `${this.peticion.UrlHost}/api/userclosesession/${userId}`; 
  
    if (userId) {
  
      this.peticion.Patch(url, {}).subscribe({
        next: (res: any) => {
          if (res.ok) {
        
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userName');
  
            
            this.router.navigate(['/login']);
          } else {
            console.error('Error al cerrar sesión:', res.message);
          }
        },
        error: (error) => {
          
          console.error('Error en la solicitud de logout:', error);
        }
      });
    } else {
      
      console.warn('No se encontró un ID de usuario válido. Redirigiendo al login...');
      this.router.navigate(['/login']);
    }
  }
}
