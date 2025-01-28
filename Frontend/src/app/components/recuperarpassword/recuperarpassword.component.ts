import { Component } from '@angular/core';
import { PeticionService } from '../../services/peticion.service';
import { MensajesService } from '../../services/mensajes.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MensajesComponent } from "../mensajes/mensajes.component";

@Component({
  selector: 'app-recuperarpassword',
  standalone: true,
  imports: [CommonModule, FormsModule, MensajesComponent],
  templateUrl: './recuperarpassword.component.html',
  styleUrl: './recuperarpassword.component.css'
})
export class RecuperarpasswordComponent {

  email: string = '';

  constructor(private peticion: PeticionService, private msg: MensajesService,private router: Router) {}

  recuperarEmail() {
    
    if (!this.email) {
      this.msg.Load('danger', 'Por favor, ingresa tu correo electrónico.');
      return;
    }
  
    const data = {
      host: this.peticion.UrlHost,
      path: "/api/recuperar-email",
      payload: {
        email: this.email
      }
    };
  
    this.peticion.Postwithouttoken(data.host + data.path, data.payload).subscribe({
      next: (res: any) => {
        console.log("Respuesta del servidor:", res);
        if (res.ok) {

          this.msg.Load('success', 'Hemos enviado un enlace a tu correo electrónico para restablecer tu contraseña.');
          // Redirigir si es necesario
          // this.router.navigate(['/login']);
        } else {
    
          this.msg.Load('danger', res.msg || 'Error al enviar el enlace.');
        }
      },
      error: (error) => {
        console.error("Error al enviar el correo de recuperación:", error);
        this.msg.Load('danger', 'Error en el servidor. Intente nuevamente.');
      }
    });
  }
}
