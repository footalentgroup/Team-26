import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-formcontacto',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './formcontacto.component.html',
  styleUrl: './formcontacto.component.css'
})
export class FormcontactoComponent {
  messageSent: boolean = false; // Controla la vista actual

  // Datos del formulario
  userName: string = '';
  userEmail: string = '';
  userCompany: string = '';
  userMessage: string = '';

  // Función para enviar el mensaje
  sendMessage(event: Event): void {
    event.preventDefault(); // Evitar el comportamiento por defecto del formulario

    // enviar los datos al backend, si es necesario
    console.log('Mensaje enviado:', {
      name: this.userName,
      email: this.userEmail,
      company: this.userCompany,
      message: this.userMessage,
    });

    // Cambiar el estado a "mensaje enviado"
    this.messageSent = true;
  }
}
