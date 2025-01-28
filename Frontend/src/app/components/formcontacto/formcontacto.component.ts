import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formcontacto',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './formcontacto.component.html',
  styleUrl: './formcontacto.component.css'
})
export class FormcontactoComponent {
  mensajeEnviado: boolean = false; 


  userName: string = '';
  userEmail: string = '';
  userCompany: string = '';
  userMessage: string = '';

  constructor(private router: Router) {} 

  /*$$$$$$$$$$$$$$$$$$ FUNCION PARA ENVIAR EL MENSAJE $$$$$$$$$$$$$$$$$$$$$$$$$$$$*/

    formMensaje(event: Event): void {
    event.preventDefault();

  /*$$$$$$$$$$$$$$$$$$ ENVIO DE DATOS AL BACKEND $$$$$$$$$$$$$$$$$$$$$$$$$$$$*/
      console.log('Mensaje enviado:', {
      name: this.userName,
      email: this.userEmail,
      company: this.userCompany,
      message: this.userMessage,
    });

    this.mensajeEnviado = true;
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 3000);
  }
}
