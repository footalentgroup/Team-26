import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DashboardadminComponent } from '../dashboardadmin/dashboardadmin.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-screen-editar',
  standalone: true,
  imports: [DashboardadminComponent,CommonModule],
  templateUrl: './screen-editar.component.html',
  styleUrl: './screen-editar.component.css'
})
export class ScreenEditarComponent implements OnInit{
  userName: string = '';
  userEmail: string = '';
  userRole: string = '';
  userPhone: string = '';
  isSuccess: boolean = false; // Para manejar el cambio de pantalla

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Obtener los parámetros enviados desde UsuariosComponent
    this.route.queryParams.subscribe((params) => {
      this.userName = params['userName'];
      this.userEmail = params['email'];
      this.userRole = params['rol'];
      this.userPhone = params['telefono'];
    });
  }

  // Confirmar los datos y pasar a la pantalla de éxito
  confirmarEdicion() {
    // Lógica para enviar los datos al backend (puedes reutilizar tu servicio aquí)
    // Suponiendo que esto se hace correctamente, cambiamos a la pantalla de éxito
    this.isSuccess = true;
  }

  // Regresar al componente Usuarios
  regresar() {
    this.router.navigate(['/usuarios']);
  }
}

  

