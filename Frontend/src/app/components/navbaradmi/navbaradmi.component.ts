import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PeticionService } from '../../services/peticion.service';

@Component({
  selector: 'app-navbaradmi',
  standalone: true,
  imports: [],
  templateUrl: './navbaradmi.component.html',
  styleUrl: './navbaradmi.component.css'
})
export class NavbaradmiComponent { 
  constructor(private router: Router,private peticion:PeticionService){}
  userName: string = '';
  userRole: string = '';

  ngOnInit() {
    // Recuperar los datos desde el localStorage
    this.userName = localStorage.getItem('userName') || 'Usuario'; 
    this.userRole = localStorage.getItem('userRole') || '';
  }
  logout() {
    console.log("cerrando sesion usuario")
    const userId = localStorage.getItem('userId'); // Obtén el ID del usuario
    const url = `${this.peticion.UrlHost}/api/userclosesession/${userId}`; // Endpoint del logout
  
    if (userId) {
      // Realiza la solicitud PATCH al backend
      this.peticion.Patch(url, {}).then((res: any) => {
        if (res.ok) {
          // Limpia el almacenamiento local
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userName');
  
          // Redirige al usuario al inicio de sesión
          this.router.navigate(['/login']);
          console.log('Sesión cerrada exitosamente.');
        } else {
          console.error('Error al cerrar sesión:', res.message);
        }
      }).catch((error) => {
        console.error('Error en la solicitud de logout:', error);
      });
    } else {
      console.warn('No se encontró un ID de usuario válido. Redirigiendo al login...');
      this.router.navigate(['/login']);
    }
  }
  
}
