import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-newusuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './newusuario.component.html',
  styleUrls: ['./newusuario.component.css'] // Corregido
})
export class NewUsuarioComponent implements OnInit {
  mostrarModal: boolean = false;

  constructor(private modalService: ModalService) {}

  ngOnInit() {
    // Suscríbete al estado del modal
    this.modalService.modalState$.subscribe((state) => {
      console.log('Estado del modal:', state);
      this.mostrarModal = state;
    });
  }

  cerrarModal() {
    this.modalService.cerrarModal(); // Cierra el modal usando el servicio
  }
}
