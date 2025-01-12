import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { NewUsuarioComponent } from '../newusuario/newusuario.component';
import { PeticionService } from '../../services/peticion.service';
import { MensajesService } from '../../services/mensajes.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


declare let $:any

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [NewUsuarioComponent, CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {
  constructor(private peticion: PeticionService,private msg:MensajesService,private router: Router) {}
  
  ngOnInit(): void {
    this.cargarDatos() 
  }
  
  mostrarModal: boolean = false;
  modalTitle: string = "Nuevo Usuario"

  currentStep: 'crear' | 'confirmar' | 'exito' = 'crear';//para manejar el flujo de las vistas de crear usuario

  datos: any[] = []
  nombre : string = "";
  Email : string = "";
  Rol: string = "";
  Telefono : string = "";
  idseleccionado:string="";
  seleccionRol: string = '';

  /*$$$$$$$$$$$$$$$$$$ FUNCION PARA CONTROLAR LA FUNCION DEL MODAL OPEN - CLOSE  $$$$$$$$$$$$$$$$$$$$$$$$$$$$*/

  abrirModal() {
    this.mostrarModal = true
    this.modalTitle = "Nuevo Usuario"; 
    
  }
  cerrarModal() {
    this.mostrarModal = false;
    this.currentStep = 'crear';
    this.nombre = '';
    this.Email = '';
    this.Rol = '';
    this.Telefono = '';
    this.seleccionRol = '';   
  }


  avanzarPaso() {
    console.log("presion de boton",this.currentStep)
    if (this.currentStep === 'crear') {
      // Valida los datos antes de pasar al paso de confirmación
      if (!this.nombre || !this.Email || !this.Telefono || !this.Rol) {
        this.msg.Load('danger', 'Por favor, complete todos los campos.');
        return;
      }

      this.currentStep = 'confirmar';
    
    } else if (this.currentStep === 'confirmar') {
      // Llama a la API para guardar al usuario
      this.guardarUsuario();
    } else if (this.currentStep === 'exito') {
      this.cerrarModal();
    }
  }

  /*$$$$$$$$$$$$$$$$$$ FUNCION PARA GUARDAR UN NUEVO USER $$$$$$$$$$$$$$$$$$$$$$$$$$$$*/

  guardarUsuario(){
  

    const nombreParts = this.nombre.trim().split(' ');
    const userName = nombreParts[0]; // Primer nombre
    const userLastName = nombreParts.slice(1).join(' '); // Apellidos (todo lo demás)

      let data = {
        host: this.peticion.UrlHost,
        path: "/api/user",
        payload: {
          userName:userName,
          userLastName:userLastName,
          userEmail:this.Email,
          userRol:this.Rol,
          userPhone:this.Telefono  
        }
      }
      console.log("informacion enviada al backend", data.payload)

      this.peticion.Post(data.host + data.path, data.payload).then((res:any)=>{
        console.log(res)
        if (res.ok) {
          this.msg.Load('success', 'Usuario registrado con éxito.');
          this.currentStep = 'exito';
        } else {
          this.msg.Load('danger', res.message || 'Error al registrar el usuario.');
        }
      })
      
    }

  /*$$$$$$$$$$$$$$$$$$ FUNCION PARA EDITAR UN REGISTRO DE UN USER $$$$$$$$$$$$$$$$$$$$$$$$$$$$*/

  editarRegistro(id:string){

  this.idseleccionado = id; 
  console.log("Editar usuario con ID:", this.idseleccionado);
  const usuario = this.datos.find((item) => item._id === id);

  if (usuario) {  
    
    this.nombre = usuario.userName + " " + (usuario.userLastName || "");
    this.Email = usuario.userEmail;
    this.Rol = usuario.userRol;
    this.Telefono = usuario.userPhone;
    this.modalTitle = "Editar Usuario";
    this.mostrarModal = true;
  } else {
    this.msg.Load("danger", "No se encontró el usuario seleccionado.");
  }
}
/*$$$$$$$$$$$$$$$$$$ FUNCION EDITAR LOS REGISTROS DEL USUARIO  $$$$$$$$$$$$$$$$$$$$$$$$$$$$*/
guardarCambios() {
  
  const nombreParts = this.nombre.trim().split(" ");
  const userName = nombreParts[0];
  const userLastName = nombreParts.slice(1).join(" ");

  
  const data = {
    userName: userName,
    userLastName: userLastName,
    userEmail: this.Email,
    userRol: this.Rol,
    userPhone: this.Telefono,
  };

  const url = `${this.peticion.UrlHost}/api/user/${this.idseleccionado}`;
  this.peticion.Patch(url, data).then((res: any) => {
    console.log("Respuesta del servidor:", res);
    if (res.ok) {
      this.msg.Load("success", "Usuario actualizado con éxito.");
      this.cargarDatos(); 
      this.cerrarModal(); 
    } else {
      this.msg.Load("danger", res.message || "Error al actualizar el usuario.");
    }
  }).catch((error) => {
    console.error("Error al actualizar el usuario:", error);
    this.msg.Load("danger", "Error en el servidor. Intente nuevamente.");
  });
}


cargarDatos(){

  let data = {
    host: this.peticion.UrlHost,
    path:"/api/user",
    payload:{}  
  }
  this.peticion.Get(data.host + data.path).then((res:any)=>{
    this.datos = res.data
    console.log("Datos cargados:", this.datos);
  }).catch(error => {
    console.error("Error al cargar datos:", error);
  });
}
cambio(role: string) {
  this.seleccionRol = role;
}


Eliminar(id:string){
  let data = {
    host: this.peticion.UrlHost,/* dominio que lo guardamos de forma publica*/
    path: "/usuarios/eliminar",
    payload: {
      _id:this.idseleccionado,
    }
  }
  this.peticion.Post(data.host + data.path, data.payload).then((res:any)=>{/*COMO SE HACE LA PETICIÓN*/
    console.log(res)
    if(res.state == false){
      this.msg.Load("danger", res.mensaje)
    }
    else{
      this.msg.Load("dark", res.mensaje)
      this.cargarDatos()
      $('#exampleModal').modal('hide')
    }
  })
  
}

}
