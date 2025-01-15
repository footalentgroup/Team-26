import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalState = new BehaviorSubject<boolean>(false);  // Estado del modal (abierto/cerrado)
  private modalCloseState = new Subject<string>();  // Estado del cierre del modal ('edit', 'reset', etc.)

  modalState$ = this.modalState.asObservable();  // Observable para el estado del modal
  modalCloseState$ = this.modalCloseState.asObservable();  // Observable para el estado de cierre del modal

  abrirModal(): void {
    console.log('Abriendo modal desde el servicio');
    this.modalState.next(true);  // Abre el modal
  }

  cerrarModal(result: string = 'reset'): void {
    this.modalState.next(false);  // Cierra el modal
    this.modalCloseState.next(result);  // Notifica el estado de cierre
  }
}

