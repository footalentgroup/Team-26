import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { NewUsuarioComponent } from '../newusuario/newusuario.component';



@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [NewUsuarioComponent],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {
  constructor(private modalService: ModalService) {}

  abrirModal() {
    console.log("entro al modal")
    this.modalService.abrirModal(); // Abre el modal usando el servicio
  }
}
