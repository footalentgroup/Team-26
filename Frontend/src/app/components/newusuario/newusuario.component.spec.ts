import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';


@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './newusuario.component.html',
  styleUrls: ['./newusuario.component.css']
})
export class NuevoUsuarioComponent implements OnInit {
  mostrarModal: boolean = false;

  constructor(private modalService: ModalService) {}

  ngOnInit() {
    // Suscríbete al estado del modal
    this.modalService.modalState$.subscribe((state) => {
      this.mostrarModal = state;
    });
  }

  cerrarModal() {
    this.modalService.cerrarModal(); // Cierra el modal usando el servicio
  }
}
