import { Component } from '@angular/core';
import { PeticionService } from '../../services/peticion.service';
import { MensajesService } from '../../services/mensajes.service';
import { Router} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MensajesComponent } from "../mensajes/mensajes.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MensajesComponent,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  constructor(private peticion:PeticionService, private msg:MensajesService, private router: Router){
    this.verificarAdmin(); 

  }
  
  email : string = ""
  password : string = ""
  title: string = "Ingresa para comenzar";
  showPassword: boolean = false;

  /*$$$$$$$$$$$$$$$$$$FUNCION PARA ACTUALIZAR TITULO EN PAGINA $$$$$$$$$$$$$$$$$$$$$$$$$$$$*/
  updateTitle() {
    if (this.email) {
      const name = this.email.split('@')[0];
      this.title = `Bienvenido, ${name}`;
    } else {
      this.title = "Ingresa para comenzar";
    }
  }
    /*$$$$$$$$$$$$$$$$$$ FUNCION PARA VERIFICAR ADMINISTRADOR $$$$$$$$$$$
    $$$$$$$$$$$$$$$$$*/
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
  /*$$$$$$$$$$$$$$$$$$ MÉTODO PARA ALTERNAR LA VISIBILIDAD DE LA CONTREASEÑA $$$$$$$$$$$$$$$$$$$$$$$*/
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  /*$$$$$$$$$$$$$$$$$$ FUNCION PARA REDIRECIONAR A FORMULARIO DE RECUPERACION PASSWORD $$$$$$$$$$$$$$$$$$$$$$$*/
  recuperarpasssword() {
    console.log("aqui ingreso RECUPERAR")
    this.router.navigate(['/recuperarpassword']);
  }
  /*$$$$$$$$$$$$$$$$$$ FUNCION PARA REALIZAR LOGIN $$$$$$$$$$$$$$$$$$$$$$$$$$$$*/
  Login() {
    console.log("Intentando iniciar sesión...");

    if (!this.email || !this.password) {
      this.msg.Load("danger", "Por favor ingresa tu correo y contraseña.");
      return;
    }

    let data = {
      host: this.peticion.UrlHost,
      path: "/api/userlogin",
      payload: {
        email: this.email,
        password: this.password
      }
    };

    this.peticion.Post(data.host + data.path, data.payload).then((res: any) => {
      console.log("Respuesta del servidor:", res);

      if (!res.ok) { 
        this.msg.Load("danger", res.msg || "Error en el login");
        return;
      }

      this.msg.Load("dark", res.msg || "Bienvenido");

      localStorage.setItem("token", res.token);
      localStorage.setItem("userId", res.userId);
      localStorage.setItem("userRole", res.userRole);
      localStorage.setItem("userName", res.userName);
      console.log("Rol guardado en localStorage:", res.userRole);

      // Redirigir a la pantalla de carga
      this.router.navigate(["/pantallacarga"]);
    }).catch((error) => {
      console.error("Error en la petición de login:", error);
      this.msg.Load("danger", "Error en el servidor. Intente nuevamente más tarde.");
    });
  }
}

