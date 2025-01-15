import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PeticionService } from '../../services/peticion.service';
import { MensajesService } from '../../services/mensajes.service';
import { Router } from '@angular/router';
import { MensajesComponent } from "../mensajes/mensajes.component";

@Component({
  selector: 'app-register-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, MensajesComponent],
  templateUrl: './register-admin.component.html',
  styleUrl: './register-admin.component.css'
})
export class RegisterAdminComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  constructor(
    private peticion: PeticionService,
    private msg: MensajesService,
    private router: Router
  ) {}

  onRegister() {
    const data = {
      host: this.peticion.UrlHost,
      path: '/api/userregisteradmin',
      payload: {
        userName: this.name,
        userEmail: this.email,
        userPassword: this.password
      }
    };
  
    console.log('Datos enviados al backend:', data.payload);
  
    // Llamar al método Post del servicio PeticionService
    this.peticion.Postwithouttoken(data.host + data.path, data.payload).subscribe({
      next: (res: any) => {
        console.log('Respuesta del servidor:', res);
        if (res.ok) {
          // Mostrar mensaje de éxito y redirigir
          this.msg.Load('success', 'Administrador registrado exitosamente');
          this.router.navigate(['/login']);
        } else {
          // Mostrar mensaje de error desde la respuesta del servidor
          this.msg.Load('danger', res.message || 'Error en el registro');
        }
      },
      error: (error) => {
        // Manejo de errores en la petición
        console.error('Error al registrar administrador:', error);
        this.msg.Load('danger', 'Error al registrar administrador. Es posible que ya exista en la base de datos.');
      }
    });
  }
}
