import { Component } from '@angular/core';
import { PeticionService } from '../../services/peticion.service';
import { MensajesService } from '../../services/mensajes.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MensajesComponent } from "../mensajes/mensajes.component";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MensajesComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private peticion: PeticionService, private msg: MensajesService, private router: Router) {
    this.verificarAdmin();
  }

  email: string = ""
  password: string = ""

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
  Login() {
    let message: string = ""
    if (this.email == "" || this.password == "") {
      switch (true) {
        case this.email === "" && this.password === "":
          message = "El correo y la contraseña son requeridos";
          break;
        case this.email === "" && this.password === "":
          message = "El correo es requerido";
          break;
        case this.password === "":
          message = "La contraseña es requerida";
          break;
      }
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: message,
        footer: '<b>Intente nuevamente</a>'
      });
    }
    else {
      /*$$$$$$$$$$$$$$$$$$ ESTRUCTURA DE LA PETICIÓN $$$$$$$$$$$$$$$$$$$$$$$$$$$$*/
      let data = {
        host: this.peticion.UrlHost,
        path: "/api/userlogin",
        payload: {
          email: this.email,
          password: this.password

        }
      }
      this.peticion.Post(data.host + data.path, data.payload).then((res: any) => {
        console.log("holla vamos aqui", res)
        if (!res.ok) {
          this.msg.Load("danger", res.msg || "Error en el login");
        }
        else
          if (res.userRole === "administrator") {
            this.msg.Load("dark", res.userName || "Bienvenido");
            this.router.navigate(["/dashboardadmin"]);
          }
          else if (res.userRole === "supervisor") {
            this.msg.Load("dark", res.userName || "Bienvenido");
            this.router.navigate(["/dashboardsup"]);
          } else {
            this.msg.Load("dark", res.userName || "Bienvenido");
            this.router.navigate(["/"]);
          }
      }).catch((error: any) => {
        console.log(error);
        //        const {errorMessage } = error.error ? error.error.msg : "Error en el login";
        const { errorMessage } = error
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: errorMessage,
          footer: '<b>Intente nuevamente</a>'
        });

      });
    }
  }
}



