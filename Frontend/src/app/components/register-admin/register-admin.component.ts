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

    this.peticion
      .Post(data.host + data.path, data.payload)
      .then((res: any) => {
        console.log(res);
        if (res.ok) {
          this.msg.Load('success', 'Administrador registrado exitosamente');
          this.router.navigate(['/login']); 
        } else {
          this.msg.Load('danger', res.message || 'Error en el registro');
        }
      })
      .catch((error) => {
        console.error('Error al registrar administrador:', error);
        this.msg.Load('danger', 'Error al registrar adminitrador ya existe uno en la dbls');
      });
  }
}
