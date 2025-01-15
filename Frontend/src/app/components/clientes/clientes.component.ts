import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MensajesService } from '../../services/mensajes.service';
import { CreateClientService } from '../../services/create-client.service';

declare let $: any;

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent {

  constructor(private clienteServices: CreateClientService, private msg: MensajesService) {}

  ngOnInit(): void {
    console.log('Estado inicial de currentStep:', this.currentStep);
    this.cargarDatos();
  }

  mostrarModal: boolean = false;
  esEditar: boolean = false;
  modalTitle: string = "Nuevo cliente";
  currentStep: 'crear' | 'confirmar' | 'exito' | 'darDeBaja' | 'motivoDeBaja' | 'exitoBaja' | null = null;

  datos: any[] = [];
  Nombre: string = "";
  Direccion: string = "";
  Telefono: string = "";
  Responsable: string = "";
  Email: string = "";
  Accion: string = "";
  idseleccionado: string = "";

  
  /*$$$$$$$$$$$$$$$$$$ FUNCION PARA CONTROLAR LA FUNCION DEL MODAL OPEN - CLOSE $$$$$$$$$$$$$$$$$$$$$$$$$$$$*/

  abrirModal() {
    this.mostrarModal = true;
    this.modalTitle = "Nuevo Cliente"; 
    this.currentStep = 'crear';
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.Nombre = '';
    this.Direccion = '';
    this.Telefono = '';
    this.Responsable = '';
    this.Email = '';  
  }

  avanzarPaso() {
    console.log("presion de boton", this.currentStep);
    if (this.currentStep === 'crear') {
      this.currentStep = 'confirmar';
    } else if (this.currentStep === 'confirmar') {
        if (this.esEditar) {
          this.guardarCambios();
        }else {
          console.log("entro aqui al llamdo a la funcion guardar");
          this.guardarCliente();
        }
    } else if (this.currentStep === 'darDeBaja') {
      this.eliminarBaja(this.idseleccionado);
    } else if (this.currentStep === 'exito' || this.currentStep === 'exitoBaja') {
      this.cargarDatos();
      this.cerrarModal();
    }
  }
/*$$$$$$$$$$$$$$$$$$ FUNCION PARA GUARDAR UN NUEVO CLIENT $$$$$$$$$$$$$$$$$$$$$$$$$$$$*/

  guardarCliente() {
    const payload = {
      clientCompanyName: this.Nombre,
      clientAddress: this.Direccion,
      clientPhone: this.Telefono,
      clientContactPerson: this.Responsable,
      clientEmail: this.Email,
      clientGeoLocation: {
        "type": "Point",
        "coordinates": [-118.243683, 34.052235] // [longitude, latitude]
      }
    };

    console.log("Datos enviados al backend:", payload);

    this.clienteServices.createClient(payload).subscribe({
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

  /*$$$$$$$$$$$$$$$$$$ FUNCION PARA EDITAR UN REGISTRO DE UN CLIENT $$$$$$$$$$$$$$$$$$$$$$$$$$$$*/

  editarRegistro(id: string) {
    this.esEditar = true;
    this.idseleccionado = id;
    console.log("Editar cliente con ID:", this.idseleccionado);
    const cliente = this.datos.find((item) => item._id === id);

      this.Nombre = cliente.clientCompanyName;
      this.Direccion = cliente.clientAddress;
      this.Telefono = cliente.clientPhone;
      this.Responsable = cliente.clientContactPerson;
      this.Email = cliente.clientEmail;
      this.modalTitle = "Editar Cliente";
      this.mostrarModal = true;
      this.idseleccionado = id;
  
  }

  guardarCambios() {
    const data = {
      clientCompanyName: this.Nombre,
      clientAddress: this.Direccion,
      clientPhone: this.Telefono,
      clientContactPerson: this.Responsable,
      clientEmail: this.Email
    };

    this.clienteServices.updateClient(this.idseleccionado, data).subscribe({
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
  /*$$$$$$$$$$$$$$$$$$ FUNCION PARA CARGAR LOS DATOS DEL CLIENT $$$$$$$$$$$$$$$$$$$$$$$$$$$$*/

  cargarDatos() {
    this.clienteServices.getClient().subscribe({
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
  /*$$$$$$$$$$$$$$$$$$ FUNCION PARA ELIMINAR UN USUARIO $$$$$$$$$$$$$$$$$$$$$$$$$$$$*/

  EliminarM(id: string) {
    console.log("Dar de baja usuario con ID:", id);
    
    const clientes = this.datos.find((item) => item._id === id);

    this.Nombre= clientes.clientCompanyName,
    this.Responsable=clientes.clientContactPerson,
    this.modalTitle = "Dar de Baja";
    this.mostrarModal = true;
    this.currentStep = 'darDeBaja';
    this.idseleccionado = id;
  }
  eliminarBaja(id: string) {
    console.log("eliminar cliente con:", id);
    
    this.clienteServices.deleteClient(id).subscribe({
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
    


