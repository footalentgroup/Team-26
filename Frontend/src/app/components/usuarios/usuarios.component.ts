import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { UserService } from '../../services/user.service'; // Reemplazo PeticionService con UserService
import { MensajesService } from '../../services/mensajes.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

declare let $: any;

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  constructor(private userService: UserService, private msg: MensajesService, private router: Router) {}

  ngOnInit(): void {
    console.log("Valor inicial de currentStep:", this.currentStep);
    this.cargarDatos();
  }

  mostrarModal: boolean = false;
  esEditar: boolean = false;
  motivoBaja: string = ""; 
  modalTitle: string = "Nuevo Usuario";

  currentStep: 'crear' | 'confirmar' | 'exito' | 'darDeBaja' | 'motivoDeBaja' | 'exitoBaja' | null = null;

  datos: any[] = [];
  nombre: string = "";
  Email: string = "";
  Role: string = "";
  Telefono: string = "";
  idseleccionado: string = "";
  seleccionRol: string = '';

  /*$$$$$$$$$$$$$$$$$$ FUNCION PARA CONTROLAR LA FUNCION DEL MODAL OPEN - CLOSE $$$$$$$$$$$$$$$$$$$$$$$$$$$$*/
  abrirModal() {
    this.mostrarModal = true;
    this.currentStep = 'crear';
    this.modalTitle = "Nuevo Usuario";
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.currentStep = 'crear';
    this.nombre = '';
    this.Email = '';
    this.Role = '';
    this.Telefono = '';
    this.seleccionRol = '';   
  }

  avanzarPaso() {

    console.log("Presionando botón:", this.currentStep);
    if (this.currentStep === 'crear') {
      this.currentStep = 'confirmar';

    } else if (this.currentStep === 'confirmar') {
      if (this.esEditar) {
        this.guardarCambios();
      } else {
        console.log("entro aqui al llamdo a la funcion guardar");
        this.guardarUsuario();
      }
    } else if (this.currentStep === 'darDeBaja') {
      this.currentStep = 'motivoDeBaja';
    } else if (this.currentStep === 'motivoDeBaja') {
      if (!this.motivoBaja.trim()) {
        this.msg.Load('danger', 'Por favor, ingrese un motivo válido.');
        return;
      }
      this.eliminarBaja( this.idseleccionado);
    } else if (this.currentStep === 'exito' || this.currentStep === 'exitoBaja') {
      this.cargarDatos();
      this.cerrarModal();
    }
  }

  /*$$$$$$$$$$$$$$$$$$ FUNCION PARA GUARDAR UN NUEVO USUARIO $$$$$$$$$$$$$$$$$$$$$$$$$$$$*/
  guardarUsuario() {
    console.log("impresion de la variable nombre",this.nombre)
    const nombreParts = this.nombre.trim().split(' ');
    const payload = {
      userName: nombreParts[0],
      userLastName: nombreParts.slice(1).join(' '),
      userEmail: this.Email,
      userRole: this.Role,
      userPhone: this.Telefono,
      userPassword:"112343243J"
    };

    console.log("Datos enviados al backend:", payload);

    this.userService.createUser(payload).subscribe({
      next: (res: any) => {
        console.log("Usuario creado:", res);
        this.msg.Load('success', 'Usuario registrado con éxito.');
        this.currentStep = 'exito';
      },
      error: (error) => {
        console.error("Error al registrar usuario:", error);
        this.msg.Load('danger', 'Error en el servidor. Intente nuevamente.');
      }
    });
  }

  /*$$$$$$$$$$$$$$$$$$ FUNCION PARA EDITAR UN REGISTRO DE UN USUARIO $$$$$$$$$$$$$$$$$$$$$$$$$$$$*/
  editarRegistro(id: string) {
    this.esEditar = true;
    const usuario = this.datos.find((item) => item._id === id);
    
      this.nombre = usuario.userName + " " + (usuario.userLastName || "");
      this.Email = usuario.userEmail;
      this.Role = usuario.userRole;
      this.Telefono = usuario.userPhone;
      this.modalTitle = "Editar Usuario";
      this.mostrarModal = true;
      this.idseleccionado = id;
  }

  /*$$$$$$$$$$$$$$$$$$ FUNCION PARA EDITAR LOS REGISTROS DEL USUARIO $$$$$$$$$$$$$$$$$$$$$$$$$$$$*/
  guardarCambios() {
    const nombreParts = this.nombre.trim().split(" ");
    const data = {
      userName: nombreParts[0],
      userLastName: nombreParts.slice(1).join(" "),
      userEmail: this.Email,
      userRole: this.Role,
      userPhone: this.Telefono,
      userPassword: "123456J"
    };

    this.userService.updateUser(this.idseleccionado, data).subscribe({
      next: (res: any) => {
        console.log("Usuario actualizado:", res);
        this.msg.Load("success", "Usuario actualizado con éxito.");
        this.cargarDatos();
        this.cerrarModal();
      },
      error: (error) => {
        console.error("Error al actualizar usuario:", error);
        this.msg.Load("danger", "Error en el servidor. Intente nuevamente.");
      }
    });
  }

  /*$$$$$$$$$$$$$$$$$$ FUNCION PARA CARGAR LOS DATOS DEL USUARIO $$$$$$$$$$$$$$$$$$$$$$$$$$$$*/
  cargarDatos() {
    this.userService.getUsers().subscribe({
      next: (res: any) => {
        this.datos = res.data;
        console.log("Datos cargados:", this.datos);
      },
      error: (error) => {
        console.error("Error al cargar datos:", error);
        this.msg.Load("danger", "Error al cargar los datos. Intente nuevamente.");
      }
    });
  }

  cambio(role: string) {
    this.seleccionRol = role;
  }

  /*$$$$$$$$$$$$$$$$$$ FUNCION PARA ELIMINAR UN USUARIO $$$$$$$$$$$$$$$$$$$$$$$$$$$$*/
  EliminarM(id: string) {
    console.log("Dar de baja usuario con ID:", id);
    
    const usuario = this.datos.find((item) => item._id === id);

    this.nombre = usuario.userName + " " + (usuario.userLastName || "");
    this.modalTitle = "Dar de Baja";
    this.mostrarModal = true;
    this.currentStep = 'darDeBaja';
    this.idseleccionado = id;
    this.motivoBaja = ""; 
    this.seleccionRol = usuario.userRole;
    console.log("Valor de seleccionRol:", this.seleccionRol);
  }
  eliminarBaja(id: string) {

    const motivo = encodeURIComponent(this.motivoBaja); // Codifica el motivo de baja
    const url = `${id}?userDeletionCause=${motivo}`; // Construye la URL con el motivo

    this.userService.deleteUser(url).subscribe({
      next: (res: any) => {
        console.log("Usuario eliminado:", res);
        this.msg.Load("success", "Usuario eliminado correctamente.");
        this.cargarDatos();
        this.cerrarModal();
      },
      error: (error) => {
        console.error("Error al eliminar usuario:", error);
        this.msg.Load("danger", "Error en el servidor. Intente nuevamente.");
      }
    });
  }
}



