import { Component } from '@angular/core';
import { PeticionService } from '../../services/peticion.service';
import { MensajesService } from '../../services/mensajes.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MensajesComponent } from "../mensajes/mensajes.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MensajesComponent, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private peticion: PeticionService, private msg: MensajesService, private router: Router) {
    this.verificarAdmin();
  }

  email: string = "";
  password: string = "";
  title: string = "Ingresa para comenzar";
  showPassword: boolean = false;

  /*$$$$$$$$$$$$$$$$$$FUNCION PARA ACTUALIZAR TITULO EN PAGINA $$$$$$$$$$$$$$$$$$$$$$$$$$$$*/
  updateTitle() {
    if (this.email) {
      const name= this.email.split('@')[0];
      this.title = `Bienvenido,${name}`;
    } else {
      this.title = "Ingresa para comenzar";
    }
  }

  /*$$$$$$$$$$$$$$$$$$ FUNCION PARA VERIFICAR ADMINISTRADOR $$$$$$$$$$$$$$$$$$$$$$$$$$$$*/
  verificarAdmin() {
    const url = `${this.peticion.UrlHost}/api/usercheckadmin`;

    this.peticion.Getwithouttoken(url).subscribe({
      next: (res: any) => {
        if (!res.hasAdministrator) {
          this.msg.Load("info", "No existe administrador. Redirigiendo al registro...");
          setTimeout(() => {
            this.router.navigate(['/register-admin']);
          }, 3000);
        }
      },
      error: (error) => {
        console.error("Error al verificar administrador:", error);
        this.msg.Load("danger", "Error al conectar con el servidor.");
      }
    });
  }

  /*$$$$$$$$$$$$$$$$$$ MÉTODO PARA ALTERNAR LA VISIBILIDAD DE LA CONTRASEÑA $$$$$$$$$$$$$$$$$$$$$$$*/
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /*$$$$$$$$$$$$$$$$$$ FUNCION PARA REDIRECCIONAR A FORMULARIO DE RECUPERACIÓN DE CONTRASEÑA $$$$$$$$$$$$$$$$$$$$$$$*/
  recuperarPassword() {
    this.router.navigate(['/recuperarpassword']);
  }

  /*$$$$$$$$$$$$$$$$$$ FUNCION PARA REALIZAR LOGIN $$$$$$$$$$$$$$$$$$$$$$$$$$$$*/
  Login() {

    if (!this.email || !this.password) {
      this.msg.Load("danger", "Por favor ingresa tu correo y contraseña.");
      return;
    }

    const url = `${this.peticion.UrlHost}/api/userlogin`;
    const payload = {
      email: this.email,
      password: this.password
    };

      this.peticion.Postwithouttoken(url, payload).subscribe({
      next: (res: any) => {
        console.log("Respuesta del servidor:", res);

        if (!res.ok) {
          this.msg.Load("danger", res.msg || "Error en el login");
          return;
        }

        this.msg.Load("dark", res.msg || "Bienvenido");

      this.msg.Load("dark", res.msg || "Bienvenido");

        localStorage.setItem("token", res.token);
        localStorage.setItem("userId", res.userId);
        localStorage.setItem("userRole", res.userRole);
        localStorage.setItem("userName", res.userName);
        this.router.navigate(["/pantallacarga"]);
      },
      error: (error) => {
        console.error("Error en la petición de login:", error);
        this.msg.Load("danger", "Error en el servidor. Intente nuevamente más tarde.");
      }
    });
  }
}
