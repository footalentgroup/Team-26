import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalState = new BehaviorSubject<boolean>(false); // Estado del modal
  modalState$ = this.modalState.asObservable(); // Observable para el estado del modal

  abrirModal() {
    console.log('Abriendo modal desde el servicio')
    this.modalState.next(true); // Abre el modal
  }

  cerrarModal() {
    this.modalState.next(false); // Cierra el modal
  }
}

