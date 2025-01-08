import { Component } from '@angular/core';
import { PeticionService } from '../../services/peticion.service';
import { MensajesService } from '../../services/mensajes.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MensajesComponent } from "../mensajes/mensajes.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MensajesComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  constructor(private peticion:PeticionService, private msg:MensajesService, private router: Router){
    this.verificarAdmin(); 
  }
  
  email : string = ""
  password : string = ""

   // Función para verificar si existe un administrador
    async verificarAdmin() {
    let data = {
      host: this.peticion.UrlHost,
      path: "/api/usercheckadmin" 
    };

    try {
      const res: any = await this.peticion.Get(data.host + data.path);
      if (!res.hasAdministrator) {
        this.msg.Load("info", "No existe administrador. Redirigiendo al registro..");
        setTimeout(() => {
          this.router.navigate(['/register-admin']); 
        }, 3000);
      }
    } catch (error) {
      console.error("Error al verificar administrador:", error);
      this.msg.Load("danger", "Error al conectar con el servidor.");
    }
  }
  Login(){

  /*$$$$$$$$$$$$$$$$$$ ESTRUCTURA DE LA PETICIÓN $$$$$$$$$$$$$$$$$$$$$$$$$$$$*/
    let data = {
      host: this.peticion.UrlHost,
      path: "/api/userlogin",
      payload: {
        email:this.email,
        password: this.password

      }
    }
    
    this.peticion.Post(data.host + data.path, data.payload).then((res:any)=>{
      console.log("holla vamos aqui",res)
      if (!res.ok) { 
        this.msg.Load("danger", res.msg || "Error en el login");
      }
      else {
        this.msg.Load("dark", res.msg || "Bienvenido");
        this.router.navigate(["/dashboardsup"]);
      }
  
  })
}
}
